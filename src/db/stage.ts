import Dexie from 'dexie'
import { database } from './database';
import { BaseIconUrl } from './../components/constants'

export interface StageRecord {
  num: number
  special: boolean
  enemyName: string
  enemyIconUrl: string
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
    special: false,
    enemyName: 'スライム',
    enemyIconUrl: BaseIconUrl + 'enemy/monster_slime.png'
  },
  {
    num: 2,
    special: false,
    enemyName: '死神',
    enemyIconUrl: BaseIconUrl + 'enemy/monster_shinigami.png'
  },
  {
    num: 3,
    special: false,
    enemyName: 'ジャックオランタン',
    enemyIconUrl: BaseIconUrl + 'enemy/monster_jackolantern.png'
  },
  {
    num: 4,
    special: false,
    enemyName: '吸血鬼',
    enemyIconUrl: BaseIconUrl + 'enemy/character_monster_kyuketsuki_01_purple.png'
  },
  {
    num: 5,
    special: false,
    enemyName: 'ドラゴン',
    enemyIconUrl: BaseIconUrl + 'enemy/monster_dragon.png'
  }
    ]);
    console.log('"stages"テーブルに初期データを登録しました');
//  } else {
//    console.log('"stages"テーブルに初期データが既にあります');
//  }
};

export const getAllStages = async (): Promise<Map<number, StageRecord>> => {
  const stagesArray = await stagesTable.toArray(); // 配列として取得
  const stagesMap = new Map<number, StageRecord>();

  stagesArray.forEach((stage) => {
    stagesMap.set(stage.num, stage); // num をキーにして Map に格納
  });

  return stagesMap;
};