import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { StorageKey } from './../components/constants'
import { createJobUrl } from './../components/createUrl'
import { playSound } from "./../components/commonLogic";
import { IconImg2, Message } from './../components/design'
import styled from "styled-components"
import { BaseSoundUrl } from "./../components/constants";
import { useBgm } from "./bgm";

const { useEffect } = React;

interface Props {
  gameInfo: {
    jobs: Map<string, JobRecord>,
    stages: Map<number, StageRecord>
  }
  setClearMaxStage: (stage: number) => void
}

const JobList = styled.ul`
  display: flex;
  list-style-type: none;
  gap: 50px
`;

const JobButton = styled.button`
  border: none;
`;


export const SelectJob: React.FC<Props> = (props) => {
  const { gameInfo, setClearMaxStage } = props

  //state、ストレージクリア処理
  React.useEffect(() => {
    setClearMaxStage(0)
    localStorage.removeItem(StorageKey)
  })
  
  const { ensureBgm } = useBgm();

  useEffect(() => {
    ensureBgm(`${BaseSoundUrl}/BGM/normal.mp3`);
  }, []);

  const navigate = useNavigate();

  const selectStage = (job: string) => {
    navigate(createJobUrl(job));
  };

  return (
    <>
    <Message>
      ジョブ　を　選択　して　ください<br />
      ジョブ　に　よって　使える　スキルが　ことなります
    </Message>
    <JobList>
      {Array.from(gameInfo.jobs.values()).map(job => (
        <li key={job.key}>
          <JobButton
            key={job.key}
            onClick={() => {
                  playSound('kettei');
                  selectStage(job.key);
            }}
            className="rounded border px-4 py-2 m-1"
          >
            <IconImg2 src={job.iconUrl} alt={job.name} />
            {job.name}
          </JobButton>
        </li>
      ))}
    </JobList>
    </>
  );
};
