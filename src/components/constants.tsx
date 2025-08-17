export const Character = {
  Player: { key: 'player', label: 'プレイヤー' },
  Enemy: { key: 'enemy', label: 'モンスター' },
} as const;

export type CharacterType = typeof Character[keyof typeof Character];

export const StorageKey = 'battle-game/clearMaxStage'

export const BaseIconUrl = '/src/images/'