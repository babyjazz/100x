import { memo, useCallback } from "react";
import cx from "classnames";
import BigNumber from "bignumber.js";
import { StarFillIcon } from "constants/images";
import { IPriceList } from "hooks/useSubPythPrices";
import { VirtualItem } from "@tanstack/react-virtual";
import styles from "./index.module.scss";

function RowComponent({
  row: t,
  likedList,
  onChange,
  index,
  virtualRow,
}: {
  index: number;
  row: IPriceList;
  likedList: string[];
  onChange: (likedList: string[]) => void;
  virtualRow: VirtualItem;
}) {
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
    <tr
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
          [styles.positive]: BigNumber(t.change ?? "0").gt("0"),
          [styles.negative]: BigNumber(t.change ?? "0").lt("0"),
        })}
      >
        {t.change ?? "0.0"}%
      </td>
    </tr>
  );
}

export default memo(RowComponent);
