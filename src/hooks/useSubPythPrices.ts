import { useEffect, useRef, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { EvmPriceServiceConnection, PriceFeed } from "@pythnetwork/pyth-evm-js";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import type { IToken } from "constants/tokens";
import { tokens } from "constants/tokens";

export interface IPriceList {
  change?: string;
  tokenName: string;
  price?: string;
}

const initialPriceList: Record<IToken["name"], IPriceList> = tokens.reduce(
  (prev, cur) => {
    return { ...prev, [cur.name]: { tokenName: cur.name } };
  },
  {}
);

export const useSubPythPrices = (): [Record<IToken["name"], IPriceList>] => {
  const [priceList, setPriceList] =
    // @ts-ignore
    useState<Record<IToken["name"], IPriceList>>(initialPriceList);
  const connection = useRef<EvmPriceServiceConnection | null>(null);

  const handleChange = (
    _priceFeed: Record<string, BigNumber>,
    _previousPriceFeed: Record<string, BigNumber>,
    tokenName: string
  ) => {
    const currentPrice = _priceFeed[tokenName] ?? BigNumber.from(0);
    const last24Price = _previousPriceFeed[tokenName] ?? BigNumber.from(0);
    const percentChanged = last24Price.isZero()
      ? BigNumber.from(0)
      : currentPrice.sub(last24Price).mul(parseUnits("1", 30)).div(last24Price);
    return formatUnits(percentChanged, 28);
  };

  const handlePrice = (
    _priceFeed: Record<string, BigNumber>,
    tokenName: string
  ) => {
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

          const change = handleChange(priceFeed, previousPriceFeed, tokenName);
          const price = handlePrice(priceFeed, tokenName);

          // Mapped display object
          setPriceList((cur) => ({
            ...cur,
            [tokenName]: { tokenName, price, change },
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
