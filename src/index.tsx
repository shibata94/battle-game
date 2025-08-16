import * as React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { JobRecord, initJobs, getAllJobs } from './db/job'
import { StageRecord, initStages, getAllStages } from './db/stage'
import { initPlayerActions, initEnemyActions } from './db/action'
import { initPotential } from './db/potential'
import { Battle } from './pages/battle'
import { SelectJob } from './pages/selectJob'
import { SelectStage } from './pages/selectStage'

const { useState, useEffect } = React

const Main: React.FC = () => {

  const [dbReady, setDbReady] = useState(false);

  const [clearMaxStage, setClearMaxStage] = useState(0);

    const [gameInfo, setGameInfo] = useState({
      jobs: [] as JobRecord[],
      stages: [] as StageRecord[]
    });

  useEffect(() => {
    (async () => {
      await initJobs();
      await initStages();
      await initPlayerActions();
      await  initEnemyActions();
      await initPotential();

      setGameInfo({
        jobs: await getAllJobs(),
        stages: await getAllStages()
      });
      setDbReady(true);
    })();
  }, []);

  return !dbReady ? <div>Loading...</div> : (
    <Router>
      <Routes>
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
        <Route path="*" element={<Navigate to="/selectJob" replace />} />
      </Routes>
    </Router>
  )
}

render(<Main />, document.getElementById('app'))
