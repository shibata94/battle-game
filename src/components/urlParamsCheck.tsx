import * as React from 'react'
import { Navigate } from 'react-router-dom';
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { createJobUrl } from './createUrl'

export const checkJobParam = (
  selectedJob: string | null,
  jobs: JobRecord[]
): JSX.Element | null => {
  if (!selectedJob || !jobs.some(j => j.key == selectedJob)) {
    console.log('WARN：URLパラメータの職業不正 選択職業：'+ selectedJob);
    return <Navigate to="/selectJob" replace />;
  }
  return null;
};

export const checkStageParam = (
  selectedStage: number,
  clearMaxStage: number,
  stages: StageRecord[],
  selectedJob: string
): JSX.Element | null => {
  const maxStageNum = Math.max(...stages.map(stage => stage.num));
  if (!(1 <= selectedStage && selectedStage <= maxStageNum) || (clearMaxStage + 1 < selectedStage)) {
    console.log('WARN：URLパラメータのステージ不正 選択職業：'+ selectedJob + ' 選択ステージ：' + selectedStage);
    return <Navigate to={createJobUrl(selectedJob)} replace />;
  }
  return null;
};
