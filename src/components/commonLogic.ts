import * as React from 'react'
import { BaseSoundUrl } from "./constants";

const soundFiles = {
  kettei: "kettei.mp3",
  nigeru: "nigeru.mp3",
  attack: "attack.mp3",
  heal: "heal.mp3",
  first_win: "first_win.mp3",
  win: "win.mp3",
  lose: "lose.mp3",
} as const;

const audioCache: Partial<Record<keyof typeof soundFiles, HTMLAudioElement>> = {};

export const preloadAllSounds = () => {
  (Object.keys(soundFiles) as (keyof typeof soundFiles)[]).forEach((key) => {
    const audio = new Audio(`${BaseSoundUrl}SE/${soundFiles[key]}`);
    audio.load();
    audioCache[key] = audio;
  });
};

export const playSound = (key: keyof typeof soundFiles) => {
  const audio = audioCache[key];
  if (audio) {
    audio.currentTime = 0; // 連打しないので巻き戻してから再生
    audio.volume = 0.006;
    audio.play();
  } else {
    console.warn(`Sound "${key}" is not preloaded`);
  }
};

export type SoundKey = keyof typeof soundFiles;
