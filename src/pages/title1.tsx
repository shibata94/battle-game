import * as React from "react";
import { useNavigate } from "react-router-dom";

export function Title({ startBgm, stopBgm }) {

  const navigate = useNavigate();

  stopBgm();

  const handleStart = () => {
    startBgm();        // BGM再生
    navigate("/selectJob"); // ゲーム画面へ遷移
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-blue-500 rounded text-xl"
      >
        ▶ Start Game
      </button>
    </div>
  );
}
