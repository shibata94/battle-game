// db.ts
import Dexie from 'dexie';

export const database = new Dexie('battle-game');

database.version(1).stores({
  jobs: '&key',
  stages: '&num',
  playerActions: '&key',
  enemyActions: '&key',
  potential: '&stage'
});
