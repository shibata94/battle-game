import Dexie from 'dexie'
import { database } from './database';
import { Character } from './../components/constants'

export interface PotentialRecord {
  stage: number
  playerMaxHP: number
  playerMaxMP: number
  enemyMaxHP: number
  enemyMaxMP: number
}

const potentialTable: Dexie.Table<PotentialRecord, number> = database.table('potential')

// 初回登録処理
export const initPotential = async () => {
  const count = await potentialTable.count();
//  if (count === 0) {
await potentialTable.clear();
    // データがまだなければ登録
  await potentialTable.bulkPut([
    { stage: 1, playerMaxHP: 300, playerMaxMP: 10, enemyMaxHP: 300, enemyMaxMP: 30 },
    { stage: 2, playerMaxHP: 500, playerMaxMP: 50, enemyMaxHP: 650, enemyMaxMP: 100 },
    { stage: 3, playerMaxHP: 1200, playerMaxMP: 150, enemyMaxHP: 1800, enemyMaxMP: 200 },
    { stage: 4, playerMaxHP: 2000, playerMaxMP: 250, enemyMaxHP: 2500, enemyMaxMP: 300 },
    { stage: 5, playerMaxHP: 4500, playerMaxMP: 350, enemyMaxHP: 6000, enemyMaxMP: 400 },
    ]);
    console.log('"potential"テーブルに初期データを登録しました');
//  } else {
//    console.log('"potential"テーブルに初期データが既にあります');
//  }
};

export type PotentialMap = {
  [Character.Player.key]: { maxHP: number; maxMP: number };
  [Character.Enemy.key]: { maxHP: number; maxMP: number };
};

export const getPotentialByStage = async (stage: number): Promise<PotentialMap> => {
  const potentialRecord = await potentialTable.get(stage);

  const potential: PotentialMap = {
    [Character.Player.key]: {
      maxHP: potentialRecord ? potentialRecord.playerMaxHP : 0,
      maxMP: potentialRecord ? potentialRecord.playerMaxMP : 0,
    },
    [Character.Enemy.key]: {
      maxHP: potentialRecord ? potentialRecord.enemyMaxHP : 0,
      maxMP: potentialRecord ? potentialRecord.enemyMaxMP : 0,
    }
  }
  return potential;
};