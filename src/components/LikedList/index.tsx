import { memo } from "react";
import styles from "./index.module.scss";
import { StarFillIcon } from "constants/images";

const LikedList = ({ tokens }: { tokens: string[] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StarFillIcon className={styles.favorite} />
        <span>Your liked TOKENs !!</span>
      </div>
      <div className={styles.list}>
        {tokens.map((t) => (
          <strong key={t}>{t}</strong>
        ))}
      </div>
    </div>
  );
};

export default memo(LikedList);
