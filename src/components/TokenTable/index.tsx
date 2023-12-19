import { useMemo, useRef } from "react";
import type { IPriceList } from "hooks/useSubPythPrices";
import { useVirtualizer } from "@tanstack/react-virtual";
import RowComponent from "components/RowTable";
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

  // Virtualize table is optional up to usecase
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 20,
  });

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
          {virtualizer.getVirtualItems().map((virtualRow, index) => (
            <RowComponent
              key={virtualRow.key}
              index={index}
              likedList={likedList}
              onChange={onChange}
              row={rows[virtualRow.index]}
              virtualRow={virtualRow}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
