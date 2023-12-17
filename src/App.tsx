import { useState } from "react";
import { useSubPythPrices } from "hooks/useSubPythPrices";
import { TokenTable } from "components/TokenTable";
import LikedList from "components/LikedList";
import { LikedTokenReport } from "components/LikedTokenReport";
import { tokens } from "constants/tokens";
import "styles/index.scss";

function App() {
  const [likedList, setLikedList] = useState<string[]>([]);
  const [priceList] = useSubPythPrices();

  return (
    <div className='app-container'>
      <div className='app-header-container'>
        <header className='app-header'>
          Token prices from {tokens.length} tokens
        </header>
        <LikedTokenReport likedTokens={likedList} priceList={priceList} />
      </div>
      <div className='app-content'>
        <LikedList tokens={likedList} />
        <TokenTable
          priceList={priceList}
          onChange={setLikedList}
          likedList={likedList}
        />
      </div>
    </div>
  );
}

export default App;
