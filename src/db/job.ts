import Dexie from 'dexie'
import { database } from './database';
import { BaseIconUrl } from './../components/constants'

export interface JobRecord {
  key: string
  name: string
  iconUrl: string
}

const jobsTable: Dexie.Table<JobRecord, string> = database.table('jobs')

// 初回登録処理
export const initJobs = async () => {
  const count = await jobsTable.count();
//  if (count === 0) {
await jobsTable.clear();
    // データがまだなければ登録
    await jobsTable.bulkPut([
  {
    key: 'wizard',
    name: '魔法使い',
    iconUrl: BaseIconUrl + 'player/character_mahotsukai.png'
  },
  {
    key: 'warrior',
    name: '戦士',
    iconUrl: BaseIconUrl + 'player/character_mahotsukai.png'
  },
  {
    key: 'archer',
    name: '弓使い',
    iconUrl: BaseIconUrl + 'player/character_mahotsukai.png'
  },
  {
    key: 'monk',
    name: '僧侶',
    iconUrl: BaseIconUrl + 'player/character_mahotsukai.png'
  },
  {
    key: 'summoner',
    name: '召喚士',
    iconUrl: BaseIconUrl + 'player/character_mahotsukai.png'
  }
    ]);
    console.log('"jobs"テーブルに初期データを登録しました');
//  } else {
//    console.log('"jobs"テーブルに初期データが既にあります');
//  }
};

export const getAllJobs = async (): Promise<Map<string, JobRecord>> => {
  const jobsArray = await jobsTable.toArray(); // 配列として取得
  const jobsMap = new Map<string, JobRecord>();

  jobsArray.forEach((job) => {
    jobsMap.set(job.key, job);
  });

  return jobsMap;
};
