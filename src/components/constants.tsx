export const Character = {
  Player: { key: 'player', label: 'プレイヤー' },
  Enemy: { key: 'enemy', label: 'モンスター' },
} as const;

export type CharacterType = typeof Character[keyof typeof Character];

export const StorageKey = 'battle-game/clearMaxStage'

export const BaseIconUrl = '/src/images/'

export const ContinueGuideMessage = '■別の 行動を 選択してください■'
export const FinishGuideMessage = '■ステージ選択画面 に 戻ります■'