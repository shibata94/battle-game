import * as React from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import styled from "styled-components";
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { checkJobParam, checkStageParam } from './../components/urlParamsCheck'
import { StorageKey } from './../components/constants'
import { MenuWrapper, MenuItem, Message, IconImg3, NormalBtn } from './../components/design'

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 30px;
  gap: 40px
`;

const SelectedJobContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const SelectStage: React.FC<{
  gameInfo: {
      jobs: Map<string, JobRecord>,
      stages: Map<number, StageRecord>
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
    <>
      <Message>
        ステージ　を　せんたく　して　ください<br />
        ステージ　は　クリアする　ごとに　かいほう　されます
      </Message>
      <Content>
        <MenuWrapper>
          {Array.from(gameInfo.stages.values()).map(stage => (
            <MenuItem
              key={stage.num}
              onClick={() => startBattle(stage.num)}
              disabled={stage.num > currentClearMaxStage + 1}
            >
              ステージ{stage.num}
            </MenuItem>
          ))}
        </MenuWrapper>
        <SelectedJobContent>
          <div>せんたく　した　ジョブ</div>
          <div>{gameInfo.jobs.get(selectedJob).name}</div>
          <IconImg3
            src={gameInfo.jobs.get(selectedJob).iconUrl}
            alt="プレイヤーアイコン"
          />
        </SelectedJobContent>
        <NormalBtn
          onClick={() => navigate("/selectJob")}
        >
          もどる
        </NormalBtn>
      </Content>
    </>
  );
};