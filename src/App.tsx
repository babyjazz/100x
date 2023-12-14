import { useState } from "react";
import { useSubPythPrices } from "./hooks/useSubPythPrices";
import { TokenTable } from "components/TokenTable";
import LikedList from "components/LikedList";
import { LikedTokenReport } from "components/LikedTokenReport";
import { tokens } from "./constants";
import "./App.css";

function App() {
  const [likedList, setLikedList] = useState<string[]>([]);
  const [priceList] = useSubPythPrices();
  //   console.log("debug #li", likedList);

  return (
    <div className='App'>
      <div style={{ margin: "4rem", textAlign: "center" }}>
        <header className='App-header'>
          Token prices from {tokens.length} tokens
        </header>
        {/* <LikedTokenReport likedTokens={likedList} tokenPrices={tokenPrices} /> */}
      </div>
      <div className='App-content'>
        <TokenTable
          priceList={priceList}
          onChange={setLikedList}
          likedList={likedList}
        />
        <LikedList tokens={likedList} />
      </div>
    </div>
  );
}

export default App;
