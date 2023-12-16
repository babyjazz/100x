import { useCallback, useMemo, useRef } from "react";
import cx from "classnames";
import { BigNumber } from "bignumber.js";
import type { IPriceList } from "hooks/useSubPythPrices";
import { StarFillIcon } from "constants/images";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const parentRef = useRef(null);

  const rows = useMemo(() => {
    return Object.values(priceList);
  }, [priceList]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 43,
    overscan: 26,
  });

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
    <div className={styles.container} ref={parentRef}>
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
          {virtualizer.getVirtualItems().map((virtualRow, index) => {
            const t = rows[virtualRow.index];
            return (
              <tr
                key={t.tokenName}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${
                    virtualRow.start - index * virtualRow.size
                  }px)`,
                }}
              >
                <td>
                  <StarFillIcon
                    role='button'
                    onClick={() => handleLikeList(t?.tokenName)}
                    className={cx(styles.favorite, {
                      [styles.filled]: likedList.includes(t?.tokenName),
                    })}
                  />{" "}
                </td>
                <td>{t.tokenName}</td>
                <td>{BigNumber(t.price ?? "0.0").toFormat()}</td>
                <td
                  className={cx({
                    [styles.positive]: BigNumber(t?.change ?? "0").gt("0"),
                    [styles.negative]: BigNumber(t?.change ?? "0").lt("0"),
                  })}
                >
                  {t?.change ?? "0.0"}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
