import Dexie from 'dexie'
import { database } from './database';

export interface StageRecord {
  num: number
  special: boolean
}

const stagesTable: Dexie.Table<StageRecord, number> = database.table('stages')

// 初回登録処理
export const initStages = async () => {
  const count = await stagesTable.count();
//  if (count === 0) {
await stagesTable.clear();
    // データがまだなければ登録
    await stagesTable.bulkPut([
  {
    num: 1,
    special: false
  },
  {
    num: 2,
    special: false
  },
  {
    num: 3,
    special: false
  },
  {
    num: 4,
    special: false
  },
  {
    num: 5,
    special: false
  }
    ]);
    console.log('"stages"テーブルに初期データを登録しました');
//  } else {
//    console.log('"stages"テーブルに初期データが既にあります');
//  }
};


export const getAllStages = async (): Promise<StageRecord[]> => {
  return await stagesTable.toArray();
};