import { useCallback } from "react";
import cx from "classnames";
import { BigNumber } from "bignumber.js";
import { tokens } from "constants/tokens";
import type { IPriceList } from "hooks/useSubPythPrices";
import { StarFillIcon } from "constants/images";
import styles from "./index.module.scss";

export const TokenTable = ({
  priceList,
  onChange,
  likedList,
}: {
  priceList: Record<string, IPriceList>;
  onChange: (likedList: string[]) => void;
  likedList: string[];
}) => {
  const handleLikeList = useCallback(
    (tokenName: string) => {
      if (likedList.find((l) => l === tokenName)) {
        const removed = likedList.filter((l) => l !== tokenName);
        onChange(removed);
      } else {
        onChange([...likedList, tokenName]);
      }
    },
    [likedList]
  );

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th />
            <th>Token</th>
            <th>Price</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t?.name}>
              <td>
                <StarFillIcon
                  role='button'
                  onClick={() => handleLikeList(t?.name)}
                  className={cx(styles.favorite, {
                    [styles.filled]: likedList.includes(t.name),
                  })}
                />{" "}
              </td>
              <td>{t.name}</td>
              <td>
                {BigNumber(priceList?.[t.name]?.price ?? "0.0").toFormat()}
              </td>
              <td
                className={cx({
                  [styles.positive]: BigNumber(
                    priceList?.[t.name]?.change ?? "0"
                  ).gt("0"),
                  [styles.negative]: BigNumber(
                    priceList?.[t.name]?.change ?? "0"
                  ).lt("0"),
                })}
              >
                {priceList?.[t.name]?.change ?? "0.0"}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
