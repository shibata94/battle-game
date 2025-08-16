import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { StorageKey } from './../components/constants'
import { createJobUrl } from './../components/createUrl'

  interface Props {
    gameInfo: {
      jobs: JobRecord[]
      stages: StageRecord[]
    }
    setClearMaxStage: (stage: number) => void
  }

export const SelectJob: React.FC<Props> = (props) => {
  const { gameInfo, setClearMaxStage } = props

  //state、ストレージクリア処理
  React.useEffect(() => {
    setClearMaxStage(0)
    localStorage.removeItem(StorageKey)
  })
  
  const navigate = useNavigate();

  const selectStage = (job: string) => {
    navigate(createJobUrl(job));
  };

  return (
    <div>
      {gameInfo.jobs.map(job => (
        <button
          key={job.key}
          onClick={() => selectStage(job.key)}
          className="rounded border px-4 py-2 m-1"
        >
          {job.name}
        </button>
      ))}
    </div>
  );
};
