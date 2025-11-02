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
  description: string
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
  // description: string
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
    // 共通
    { key: 'demo', name: 'デモ用', job: 'all', skillReleaseStage: 1, type1: 'normal', type2: 'attack', multiplier: 5, description: '一撃でたおす' },

    // 共通
    { key: 'normalAttack', name: 'つうじょうこうげき', job: 'all', skillReleaseStage: 1, type1: 'normal', type2: 'attack', multiplier: 0.05, description: '武器で攻撃する。' },
    { key: 'normalHeal', name: 'かいふく', job: 'all', skillReleaseStage: 1, type1: 'normal', type2: 'heal', multiplier: 0.03, description: 'HPを少し回復する。' },

    // 魔法使い
    { key: 'fire', name: 'ファイア', job: 'wizard', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.10, description: '炎で攻撃する。' },
    { key: 'thunder', name: 'サンダー', job: 'wizard', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.11, description: '雷で攻撃する。' },
    { key: 'ice', name: 'アイス', job: 'wizard', skillReleaseStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.12, description: '氷で攻撃する。' },
    { key: 'flare', name: 'フレア', job: 'wizard', skillReleaseStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.13, description: '強力な火炎魔法。' },
    { key: 'blizzaga', name: 'ブリザガ', job: 'wizard', skillReleaseStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.14, description: '氷結魔法の上級版。' },
    { key: 'meteor', name: 'メテオ', job: 'wizard', skillReleaseStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.15, description: '隕石を降らせる最強魔法。' },

    // 戦士
    { key: 'powerSlash', name: 'パワースラッシュ', job: 'warrior', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.10, description: '力を込めた斬撃。' },
    { key: 'chargeSlash', name: 'チャージスラッシュ', job: 'warrior', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.11, description: '溜めてから放つ一撃。' },
    { key: 'shieldBash', name: 'シールドバッシュ', job: 'warrior', skillReleaseStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.12, description: '盾で殴りつける。' },
    { key: 'whirlwind', name: '旋風斬り', job: 'warrior', skillReleaseStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.13, description: '剣を振り回す大技。' },
    { key: 'overstrike', name: 'オーバーストライク', job: 'warrior', skillReleaseStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.14, description: '渾身の超必殺。' },
    { key: 'dragonSmash', name: 'ドラゴンスマッシュ', job: 'warrior', skillReleaseStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.15, description: '竜を砕く一撃。' },

    // 弓使い
    { key: 'doubleShot', name: '火矢', job: 'archer', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.10, description: '炎をまとった矢。' },
    { key: 'poisonArrow', name: '毒矢', job: 'archer', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.11, description: '毒を塗った矢で攻撃。' },
    { key: 'flameArrow', name: '氷矢', job: 'archer', skillReleaseStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.12, description: '氷をまとった矢。' },
    { key: 'paralyzeArrow', name: '麻痺矢', job: 'archer', skillReleaseStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.13, description: '相手をしびれさせる矢。' },
    { key: 'piercingShot', name: '貫通射撃', job: 'archer', skillReleaseStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.14, description: '防御を貫く矢。' },
    { key: 'divineArrow', name: '天翔の一矢', job: 'archer', skillReleaseStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.15, description: '天空から放つ究極の矢。' },

    // 僧侶
    { key: 'heal', name: 'ヒール', job: 'monk', skillReleaseStage: 1, type1: 'skill', type2: 'heal', multiplier: 0.10, description: 'HPを回復する。' },
    { key: 'smite', name: 'スマイト', job: 'monk', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.10, description: '聖なる力で殴りつける。' },
    { key: 'holy', name: 'ホーリー', job: 'monk', skillReleaseStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.11, description: '光の魔法で攻撃。' },
    { key: 'greaterHeal', name: 'グレーターヒール', job: 'monk', skillReleaseStage: 3, type1: 'skill', type2: 'heal', multiplier: 0.12, description: 'より強力な回復魔法。' },
    { key: 'sacredLight', name: 'セイクリッドライト', job: 'monk', skillReleaseStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.13, description: '聖光で敵を焼き払う。' },
    { key: 'divineJudgement', name: 'ディバインジャッジ', job: 'monk', skillReleaseStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.14, description: '神の裁きを下す。' },

    // 召喚士
    { key: 'minorSummon', name: '小召喚', job: 'summoner', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.10, description: '小さな魔物を呼び出す。' },
    { key: 'spiritArrow', name: '精霊の矢', job: 'summoner', skillReleaseStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.11, description: '精霊の力を宿した矢。' },
    { key: 'spiritSummon', name: '精霊召喚', job: 'summoner', skillReleaseStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.12, description: '精霊を召喚して攻撃。' },
    { key: 'phantomBeast', name: '幻獣召喚', job: 'summoner', skillReleaseStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.13, description: '幻獣を呼び出す。' },
    { key: 'grandSpirit', name: '大精霊召喚', job: 'summoner', skillReleaseStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.14, description: '大いなる精霊を呼ぶ。' },
    { key: 'ultimateSummon', name: '究極召喚', job: 'summoner', skillReleaseStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.15, description: '最強の召喚獣を呼び出す。' },
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
    // 共通
    { key: 'normalAttack', name: 'つうじょうこうげき', targetStage: null, type1: 'normal', type2: 'attack', multiplier: 0.03 },
    { key: 'normalHeal', name: 'かいふく', targetStage: null, type1: 'normal', type2: 'heal', multiplier: 0.02 },

    // ステージ1
    { key: 'gob_1', name: 'スライムバウンド', targetStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.09 },
    { key: 'gob_2', name: 'スライムショット', targetStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.10 },
    { key: 'gob_3', name: 'スライムブレス', targetStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.11 },
    { key: 'gob_4', name: 'アシッドスプラッシュ', targetStage: 1, type1: 'skill', type2: 'attack', multiplier: 0.12 },

    // ステージ2
    { key: 'liz_1', name: '火炎の牙', targetStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.11 },
    { key: 'liz_2', name: '火の息吹', targetStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.13 },
    { key: 'liz_3', name: '火柱', targetStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.14 },
    { key: 'liz_4', name: '業火噴射', targetStage: 2, type1: 'skill', type2: 'attack', multiplier: 0.15 },

    // ステージ3
    { key: 'sha_1', name: 'ダークショット', targetStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.11 },
    { key: 'sha_2', name: 'シャドウボルト', targetStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.13 },
    { key: 'sha_3', name: 'ソウルドレイン', targetStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.15 },
    { key: 'sha_4', name: '闇の奔流', targetStage: 3, type1: 'skill', type2: 'attack', multiplier: 0.16 },

    // ステージ4
    { key: 'ice_1', name: 'アイスパンチ', targetStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.14 },
    { key: 'ice_2', name: '氷塊投げ', targetStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.15 },
    { key: 'ice_3', name: '氷結スマッシュ', targetStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.16 },
    { key: 'ice_4', name: '絶対零度', targetStage: 4, type1: 'skill', type2: 'attack', multiplier: 0.17 },

    // ステージ5
    { key: 'dra_1', name: 'テイルスイング', targetStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.14 },
    { key: 'dra_2', name: 'ファングクラッシュ', targetStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.16 },
    { key: 'dra_3', name: 'メガフレイム', targetStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.18 },
    { key: 'dra_4', name: 'ドラゴニックインパクト', targetStage: 5, type1: 'skill', type2: 'attack', multiplier: 0.19 },
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
  const actions = await playerActionsTable.toArray();//.orderBy('multiplier')

  return actions.map(action => ({
    ...action,
    damageOrHeal: Math.round(maxHP * action.multiplier),
    consumptionMP: action.type1 === 'skill' ? Math.round(maxMP * action.multiplier * 3) : 0
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
    damageOrHeal: Math.round(maxHP * action.multiplier),
    consumptionMP: action.type1 === 'skill' ? Math.round(maxMP * action.multiplier * 3) : 0
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
    damageOrHeal: Math.round(maxHP * action.multiplier),
    consumptionMP: action.type1 === 'skill' ? Math.round(maxMP * action.multiplier * 3) : 0
  };
};
