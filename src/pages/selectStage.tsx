import * as React from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import styled from "styled-components";
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { checkJobParam, checkStageParam } from './../components/urlParamsCheck'
import { playSound } from "./../components/commonLogic";
import { StorageKey } from './../components/constants'
import { MenuWrapper, MenuItem, Message, IconImg3, NormalBtnWrapper, Tooltip, NormalBtn } from './../components/design'
import { BaseSoundUrl } from "./../components/constants";
import { useBgm } from "./bgm";

const { useEffect } = React;


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

  const { ensureBgm } = useBgm();

  useEffect(() => {
    ensureBgm(`${BaseSoundUrl}/BGM/normal.mp3`);
  }, []);

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
        ステージ　を　選択　して　ください<br />
        ステージ　は　クリアする　たびに　解放　されます
      </Message>
      <Content>
        <MenuWrapper>
          {Array.from(gameInfo.stages.values()).map(stage => (
            <MenuItem
              key={stage.num}
              onClick={() => {
                playSound('kettei');
                startBattle(stage.num)
              }}
              disabled={stage.num > currentClearMaxStage + 1}
            >
              ステージ{stage.num}
            </MenuItem>
          ))}
        </MenuWrapper>
        <SelectedJobContent>
          <div>選択　した　ジョブ</div>
          <div>{gameInfo.jobs.get(selectedJob).name}</div>
          <IconImg3
            src={gameInfo.jobs.get(selectedJob).iconUrl}
            alt="プレイヤーアイコン"
          />
        </SelectedJobContent>
        <NormalBtnWrapper>
          <NormalBtn
            onClick={() => {
              playSound('kettei');
              navigate("/selectJob")
            }}
          >
            ジョブ<br />えらびなおし
          </NormalBtn>
          <Tooltip className="tooltip">！注意！<br />クリア情報　は　リセット　されます。</Tooltip>
        </NormalBtnWrapper>
      </Content>
    </>
  );
};