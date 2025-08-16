import Dexie from 'dexie'
import { database } from './database';

export interface JobRecord {
  key: string
  name: string
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
    name: '魔法使い'
  },
  {
    key: 'warrior',
    name: '戦士'
  },
  {
    key: 'archer',
    name: '弓使い'
  },
  {
    key: 'monk',
    name: '僧侶'
  },
  {
    key: 'summoner',
    name: '召喚士'
  }
    ]);
    console.log('"jobs"テーブルに初期データを登録しました');
//  } else {
//    console.log('"jobs"テーブルに初期データが既にあります');
//  }
};


export const getAllJobs = async (): Promise<JobRecord[]> => {
  return await jobsTable.toArray();
};