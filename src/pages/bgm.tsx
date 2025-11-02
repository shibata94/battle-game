import * as React from "react";
import { createContext, useContext, useRef, useState, useEffect } from "react";

type BgmContextType = {
  setBgm: (src: string | null) => void;
  ensureBgm: (src: string) => void;
  stopBgm: () => void;
};

const BgmContext = createContext<BgmContextType | null>(null);

export const BgmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current && src) {
      audioRef.current.src = src;
      audioRef.current.volume = 0.004;
      audioRef.current.play().catch(err => console.log("再生失敗:", err));
    }
  }, [src]);

  const stopBgm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const ensureBgm = (newSrc: string) => {
    if (!audioRef.current) return;

    // すでに同じ曲が鳴っていたら何もしない
    const isSameSrc = audioRef.current.src.includes(newSrc);
    const isPlaying = !audioRef.current.paused;

    if (isSameSrc && isPlaying) {
      return;
    }

    // それ以外なら強制的に再生
    setSrc(newSrc);
  };
  
  return (
    <BgmContext.Provider value={{ setBgm: setSrc, ensureBgm, stopBgm }}>
      <audio ref={audioRef} loop />
      {children}
    </BgmContext.Provider>
  );
};

export const useBgm = () => {
  const ctx = useContext(BgmContext);
  if (!ctx) throw new Error("useBgm must be used inside BgmProvider");
  return ctx;
};
