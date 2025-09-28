import * as React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { BgmProvider } from './pages/bgm'
import { JobRecord, initJobs, getAllJobs } from './db/job'
import { StageRecord, initStages, getAllStages } from './db/stage'
import { initPlayerActions, initEnemyActions } from './db/action'
import { initPotential } from './db/potential'
import { preloadAllSounds } from './components/commonLogic'
import { Title } from './pages/title'
import { Battle } from './pages/battle'
import { SelectJob } from './pages/selectJob'
import { SelectStage } from './pages/selectStage'
import { createGlobalStyle } from 'styled-components'
import { BaseSoundUrl } from "./components/constants";


const { useState, useEffect, useRef } = React

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'PixelMplus10';
    src: url('/src/fonts/PixelMplus10-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'PixelMplus10', monospace;
    background-color: black;
    color: white;
    font-size: 16px;
  }

  div {
    user-select: none;
  }

  button {
    font-family: 'PixelMplus10', monospace;
    background-color: black;
    color: white;
    font-size: 16px;
    border: 2px solid white;
    padding: 8px 12px;
    cursor: pointer;
  }

  button:hover {
    background-color: #111;
  }

  button:focus {
    outline: 2px solid white;
  }
`;

const Main: React.FC = () => {

  const [dbReady, setDbReady] = useState(false);

  const [clearMaxStage, setClearMaxStage] = useState(0);

    const [gameInfo, setGameInfo] = useState({
      jobs: new Map<string, JobRecord>(),
      stages: new Map<number, StageRecord>()
    });

  useEffect(() => {
    (async () => {
      preloadAllSounds();

      await initJobs();
      await initStages();
      await initPlayerActions();
      await initEnemyActions();
      await initPotential();

      setGameInfo({
        jobs: await getAllJobs(),
        stages: await getAllStages()
      });
      setDbReady(true);
    })();
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  return !dbReady ? <div>Loading...</div> : (
    <>
      <GlobalStyle />
      <BgmProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Title />} />
            <Route path="/selectJob" element={
                <SelectJob 
                  gameInfo={gameInfo}
                  setClearMaxStage={setClearMaxStage}
                />
              } />
            <Route path="/selectStage" element={
                <SelectStage 
                  gameInfo={gameInfo}
                />
              } />
            <Route path="/battle" element={
                <Battle
                  gameInfo={gameInfo}
                  setClearMaxStage={setClearMaxStage}
                />
              } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </BgmProvider>
    </>
  )
}

render(<Main />, document.getElementById('app'))
