import { IToken, tokens } from "../constants";

export const TokenTable = ({
  priceList,
  onChange,
  likedList,
}: {
  priceList: Record<string, any>;
  onChange: (likedList: string[]) => void;
  likedList: string[];
}) => {
  const handleLikeList = (tokenName: string) => {
    if (likedList.find((l) => l === tokenName)) {
      const removed = likedList.filter((l) => l !== tokenName);
      onChange(removed);
    } else {
      onChange([...likedList, tokenName]);
    }
  };

  return (
    <div style={{ padding: 8, width: "70%" }}>
      <table>
        <thead>
          <tr>
            <th>ACTION</th>
            <th>TOKEN</th>
            <th>PRICE</th>
            <th>%CHANGE</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t?.name}>
              <td>
                <button onClick={() => handleLikeList(t?.name)}>
                  {likedList.includes(t.name) ? "Liked" : "Like"}
                </button>
              </td>
              <td>{t.name}</td>
              <td style={{ textAlign: "right" }}>
                {priceList?.[t.name]?.price}
              </td>
              {/* todo: show red number when change is negative */}
              {/*       show green number when change is positive */}
              <td style={{ textAlign: "right" }}>
                {priceList?.[t.name]?.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
