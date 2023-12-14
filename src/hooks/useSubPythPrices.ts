import { useEffect, useRef, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { EvmPriceServiceConnection, PriceFeed } from "@pythnetwork/pyth-evm-js";
import { tokens } from "../constants";

export const useSubPythPrices = (): [
  Record<string, BigNumber>,
  Record<string, BigNumber>
] => {
  const [previousPriceFeed, setPreviousPriceFeed] = useState<
    Record<string, BigNumber>
  >({});
  const [priceFeed, setPriceFeed] = useState<Record<string, BigNumber>>({});
  const connection = useRef<EvmPriceServiceConnection | null>(null);

  useEffect(() => {
    if (!connection.current) {
      connection.current = new EvmPriceServiceConnection(
        "https://xc-mainnet.pyth.network"
      );
      connection.current.subscribePriceFeedUpdates(
        tokens.map((t) => t.priceId),
        (feed) => {
          const tokenName = tokens.find(
            (t) => t.priceId.toLowerCase() === "0x".concat(feed.id)
          )!.name;
          const _price = parsePriceToIPythPrice(feed);
          setPreviousPriceFeed((cur) => {
            if (cur[tokenName] && cur[tokenName].gt(BigNumber.from(0)))
              return cur;
            return {
              ...cur,
              [tokenName]: _price,
            };
          });
          setPriceFeed((cur) => {
            return {
              ...cur,
              [tokenName]: _price,
            };
          });
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

  return [priceFeed, previousPriceFeed];
};

const parsePriceToIPythPrice = (priceFeed: PriceFeed): BigNumber => {
  const _price = priceFeed.getPriceUnchecked();

  const price = BigNumber.from(_price.price);
  const expoToE30 = BigNumber.from(10).pow(30 + _price.expo);

  return price.mul(expoToE30);
};
