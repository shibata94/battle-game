import * as React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { playSound } from "./../components/commonLogic";
import { BaseIconUrl, BaseSoundUrl } from "./../components/constants";
import { useBgm } from "./bgm";
import { blink } from './../components/design'

// export const TitleTitle = styled.div`
//   width: 100%;
//   ${tooltipHoverStyle}
// `;

const styles = {
  fullScreen: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    color: "white",
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#3B82F6",
    borderRadius: "8px",
    fontSize: "1.25rem",
  },
};

const TextBlink = styled.span`
  font-size: 24px;
  text-align: center;
  animation: ${blink} 3s infinite;
`;

export const TitleLogo = styled.img`
  width: 600px;
  height: 200px;
`;

export function Title() {

  const { ensureBgm } = useBgm();
  const navigate = useNavigate();

  const handleStart = () => {
    ensureBgm(`${BaseSoundUrl}/BGM/normal.mp3`);
    navigate("/selectJob"); // ゲーム画面へ遷移
  };

  return (
    <div onClick={() => {
      playSound('kettei');
      handleStart();
    }}
    style={styles.fullScreen}>
      <TitleLogo src={`${BaseIconUrl}titleLogo.png`} />
      <TextBlink>▶ 画面　を　クリック<br />※ 音　が　鳴ります ※</TextBlink>
    </div>
  );
}
