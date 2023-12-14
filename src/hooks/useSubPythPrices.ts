import { useEffect, useRef, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { EvmPriceServiceConnection, PriceFeed } from "@pythnetwork/pyth-evm-js";
import { IToken, tokens } from "../constants";
import { formatUnits, parseUnits } from "ethers/lib/utils";

interface IPriceFeed {
  change?: string;
  tokenName?: string;
  price?: string;
}

export const useSubPythPrices = (): [Record<string, any>] => {
  const [priceList, setPriceList] = useState<IPriceFeed>({});
  const connection = useRef<EvmPriceServiceConnection | null>(null);

  const handleChange = (
    _priceFeed: any,
    _previousPriceFeed: any,
    tokenName: string
  ) => {
    const currentPrice = _priceFeed[tokenName] ?? BigNumber.from(0);
    const last24Price = _previousPriceFeed[tokenName] ?? BigNumber.from(0);
    const percentChanged = last24Price.isZero()
      ? BigNumber.from(0)
      : currentPrice.sub(last24Price).mul(parseUnits("1", 30)).div(last24Price);
    return formatUnits(percentChanged, 28) + "%";
  };

  const handlePrice = (_priceFeed: any, tokenName: string) => {
    const price = _priceFeed[tokenName] ?? BigNumber.from(0);

    return formatUnits(price, 30);
  };

  useEffect(() => {
    if (!connection.current) {
      connection.current = new EvmPriceServiceConnection(
        "https://xc-mainnet.pyth.network"
      );
      let previousPriceFeed: Record<string, BigNumber> = {};
      let priceFeed: Record<string, BigNumber> = {};
      connection.current.subscribePriceFeedUpdates(
        tokens.map((t) => t.priceId),
        (feed) => {
          const tokenName = tokens.find(
            (t) => t.priceId.toLowerCase() === "0x".concat(feed.id)
          )!.name;
          const _price = parsePriceToIPythPrice(feed);

          // set previou sprice feed
          if (
            !previousPriceFeed[tokenName] ||
            !previousPriceFeed[tokenName].gt(BigNumber.from(-1))
          ) {
            previousPriceFeed = {
              ...previousPriceFeed,
              [tokenName]: _price,
            };
          }

          // set price feed
          priceFeed = { ...priceFeed, [tokenName]: _price };

          // handle
          const change = handleChange(priceFeed, previousPriceFeed, tokenName);
          const price = handlePrice(priceFeed, tokenName);

          // result
          setPriceList((cur) => ({
            ...cur,
            [tokenName]: {
              tokenName,
              change,
              price,
            },
          }));
        }
      );
    }
    return () => {
      if (connection.current) {
        connection.current.closeWebSocket();
        connection.current = null;
      }
    };
  }, []);

  return [priceList];
};

const parsePriceToIPythPrice = (priceFeed: PriceFeed): BigNumber => {
  const _price = priceFeed.getPriceUnchecked();

  const price = BigNumber.from(_price.price);
  const expoToE30 = BigNumber.from(10).pow(30 + _price.expo);

  return price.mul(expoToE30);
};
