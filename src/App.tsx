import { useState } from "react";
import "./App.css";
import { useSubPythPrices } from "./hooks/useSubPythPrices";
import { TokenTable } from "components/TokenTable";
import { LikedList } from "components/LikedList";
import { LikedTokenReport } from "components/LikedTokenReport";
import { tokens } from "./constants";

function App() {
  const [likedList, setLikedList] = useState<string[]>([]);
  const [tokenPrices, previousTokenPrices] = useSubPythPrices();

  return (
    <div className='App'>
      <div style={{ margin: "4rem", textAlign: "center" }}>
        <header className='App-header'>
          Token prices from {tokens.length} tokens
        </header>
        <LikedTokenReport likedTokens={likedList} tokenPrices={tokenPrices} />
      </div>
      <div className='App-content'>
        <TokenTable
          tokenPrices={tokenPrices}
          previousPrices={previousTokenPrices}
          onChange={setLikedList}
        />
        <LikedList tokens={likedList} />
      </div>
    </div>
  );
}

export default App;
