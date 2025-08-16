export const Character = {
  Player: { key: 'player', label: 'プレイヤー' },
  Enemy: { key: 'enemy', label: '敵' },
} as const;

export type CharacterType = typeof Character[keyof typeof Character];

export const StorageKey = 'battle-game/clearMaxStage'