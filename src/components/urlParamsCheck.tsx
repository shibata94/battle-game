import * as React from 'react'
import { Navigate } from 'react-router-dom';
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { createJobUrl } from './createUrl'

export const checkJobParam = (
  selectedJob: string | null,
  jobs: Map<string, JobRecord>
): JSX.Element | null => {
  if (!selectedJob || !jobs.has(selectedJob)) {
    console.log('WARN：URLパラメータの職業不正 選択職業：' + selectedJob);
    return <Navigate to="/selectJob" replace />;
  }
  return null;
};

export const checkStageParam = (
  selectedStage: number,
  clearMaxStage: number,
  stages: Map<number, StageRecord>,
  selectedJob: string
): JSX.Element | null => {
  const stageNums = Array.from(stages.values()).map(stage => stage.num);
  const maxStageNum = Math.max(...stageNums);

  if (!(1 <= selectedStage && selectedStage <= maxStageNum) || (clearMaxStage + 1 < selectedStage)) {
    console.log(
      'WARN：URLパラメータのステージ不正 選択職業：' +
        selectedJob +
        ' 選択ステージ：' +
        selectedStage
    );
    return <Navigate to={createJobUrl(selectedJob)} replace />;
  }
  return null;
};