import { useMemo } from "react";
import { BigNumber } from "bignumber.js";
import type { IPriceList } from "hooks/useSubPythPrices";
import type { IToken } from "constants/tokens";
import styles from "./index.module.scss";

export const LikedTokenReport = ({
  likedTokens,
  priceList,
}: {
  likedTokens: string[];
  priceList: Record<IToken["name"], IPriceList>;
}) => {
  const winner = useMemo(() => {
    return likedTokens.reduce<string>((winner, token) => {
      if (winner === "X") return token;
      const _price0 = BigNumber(priceList?.[winner]?.price ?? "0");
      const _price1 = BigNumber(priceList?.[token]?.price ?? "0");
      if (!_price0 || !_price1) return winner;
      return _price0.gt(_price1) ? winner : token;
    }, "X");
  }, [likedTokens, priceList]);

  const loser = useMemo(() => {
    return likedTokens.reduce<string>((loser, token) => {
      if (loser === "X") return token;
      const _price0 = BigNumber(priceList?.[loser]?.price ?? "0");
      const _price1 = BigNumber(priceList?.[token]?.price ?? "0");
      if (!_price0 || !_price1) return loser;
      return _price0.lt(_price1) ? loser : token;
    }, "X");
  }, [likedTokens, priceList]);

  return (
    <div className={styles.container}>
      <div className={styles.winner}>HIGHEST Price liked TOKEN: {winner}</div>
      <div className={styles.divider} />
      <div className={styles.loser}>LOWEST Price liked TOKEN: {loser}</div>
    </div>
  );
};
