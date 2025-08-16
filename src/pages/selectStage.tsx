import * as React from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { checkJobParam, checkStageParam } from './../components/urlParamsCheck'
import { StorageKey } from './../components/constants'

export const SelectStage: React.FC<{
  gameInfo: {
    jobs: JobRecord[];
    stages: StageRecord[];
  };
}> = ({ gameInfo }) => {

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedJob: string | null = params.get('job');

  const jobRedirect = checkJobParam(selectedJob, gameInfo.jobs);
  if (jobRedirect) return jobRedirect;

  const clearMaxStageObj = localStorage.getItem(StorageKey)
  const currentClearMaxStage: number = clearMaxStageObj ? JSON.parse(clearMaxStageObj)[selectedJob] ?? 0: 0

  const startBattle = (stage: number) => {
    const params = new URLSearchParams({ job: selectedJob, stage: String(stage) });
    navigate(`/battle?${params.toString()}`);
  };

  return (
    <div>
      {gameInfo.stages.map(stage => (
        <button
          key={stage.num}
          onClick={() => startBattle(stage.num)}
          disabled={stage.num > currentClearMaxStage + 1}
          className="rounded border px-4 py-2 m-1"
        >
          ステージ{stage.num}
        </button>
      ))}
    </div>
  );
};