import Dexie from 'dexie'
import { database } from './database';

export interface PlayerActionRecord {
  key: string
  name: string
  job: string
  skillReleaseStage: number
  type1: string
  type2: string
  multiplier: number //倍率
  //description: string
}

export interface PlayerActionDto extends PlayerActionRecord {
  damageOrHeal: number
  consumptionMP: number
}

export interface EnemyActionRecord {
  key: string
  name: string
  targetStage: number
  type1: string
  type2: string
  multiplier: number //倍率
  //description: string
}

export interface EnemyActionDto extends EnemyActionRecord {
  damageOrHeal: number
  consumptionMP: number
}

const playerActionsTable: Dexie.Table<PlayerActionRecord, string> = database.table('playerActions')
const enemyActionsTable: Dexie.Table<EnemyActionRecord, string> = database.table('enemyActions')

// 初回登録処理
export const initPlayerActions = async () => {
  const count = await playerActionsTable.count();
//  if (count === 0) {
  await playerActionsTable.clear();
  await playerActionsTable.bulkPut([
    { key: 'normalAttack', name: 'つうじょうこうげき', job: 'all', skillReleaseStage: 1, type1: 'normal', type2: 'attack', multiplier: 0.2 },
    { key: 'normalHeal', name: 'かいふく', job: 'all', skillReleaseStage: 1, type1: 'normal', type2: 'heal', multiplier: 0.05 },
    { key: 'fire', name: 'ファイア', job: 'wizard', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.2 },
    { key: 'thunder', name: 'サンダー', job: 'wizard', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.3 },
    { key: 'ice', name: 'アイス', job: 'wizard', skillReleaseStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.4 },
  ]);
  console.log('"playerActions"テーブルに初期データを登録しました');
//  } else {
//    console.log('"playerActions"テーブルに初期データが既にあります');
//  }
};

export const initEnemyActions = async () => {
  const count = await enemyActionsTable.count();
//  if (count === 0) {
  await enemyActionsTable.clear();
  await enemyActionsTable.bulkPut([
    { key: 'normalAttack', name: 'つうじょうこうげき', targetStage: null, type1: 'normal', type2: 'attack', multiplier: 0.18 },
    { key: 'normalHeal', name: 'かいふく', targetStage: null, type1: 'normal', type2: 'heal', multiplier: 0.05 },
    { key: 'fire', name: 'ファイア', targetStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.2 },
    { key: 'thunder', name: 'サンダー', targetStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.3 },
  ]);
  console.log('"enemyActions"テーブルに初期データを登録しました');
//    } else {
//    console.log('"enemyActions"テーブルに初期データが既にあります');
//  }
};

export const getEnemyActionKeysByStage = async (targetStage: number): Promise<string[]> => {
  const actions = await enemyActionsTable
    .filter(action => action.type1 == 'normal' || action.targetStage == targetStage)
    .toArray();

  return actions.map(action => action.key);
};

export const getPlayerActions = async (
  maxHP: number,
  maxMP: number
): Promise<PlayerActionDto[]> => {
  const actions = await playerActionsTable.toArray();

  return actions.map(action => ({
    ...action,
    damageOrHeal: Math.floor(maxHP * action.multiplier),
    consumptionMP: action.type1 === 'skill' ? Math.floor(maxMP * action.multiplier) : 0
  }));
};


// 取得時に最大HP/MPを受け取り計算する関数
export const getPlayerSelectedAction = async (
  actionKey: string,
  maxHP: number,
  maxMP: number
): Promise<PlayerActionDto> => {
  const action = await playerActionsTable.get(actionKey);
  if (!action) return null;

  return {
    ...action,
    damageOrHeal: Math.floor(maxHP * action.multiplier),
    consumptionMP: action.type1 === 'skill' ? Math.floor(maxMP * action.multiplier) : 0
  };
};

export const getEnemySelectedAction = async (
  actionKey: string,
  maxHP: number,
  maxMP: number
): Promise<EnemyActionDto> => {
  const action = await enemyActionsTable.get(actionKey);
  if (!action) return null;

  return {
    ...action,
    damageOrHeal: Math.floor(maxHP * action.multiplier),
    consumptionMP: action.type1 === 'skill' ? Math.floor(maxMP * action.multiplier) : 0
  };
};
