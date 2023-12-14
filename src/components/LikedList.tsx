import { memo } from "react";

const LikedList = ({ tokens }: { tokens: string[] }) => {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <strong>Your liked TOKENs !!</strong>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tokens.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
    </div>
  );
};

export default memo(LikedList);
