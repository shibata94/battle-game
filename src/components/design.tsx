import styled, { keyframes } from 'styled-components'

// 上下に揺れるアニメーション
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }  // 上に移動
  100% { transform: translateY(0); }
`;


export const IconImg2 = styled.img`
  display: block;
  width: 64px;
  height: 64px;
  animation: ${float} 1.5s ease-in-out infinite; // 無限ループ
`;

export const IconImg3 = styled.img`
  display: block;
  width: 64px;
  height: 64px;
  margin-top: 20px;
  animation: ${float} 1.5s ease-in-out infinite; // 無限ループ
`;

export const IconImg = styled.img`
  width: 64px;
  height: 64px;
  animation: ${float} 1.5s ease-in-out infinite; // 無限ループ
  z-index: 1; /* エフェクトの前面に配置 */
`;

export const Effect = styled.div<{ type: 'attack' | 'heal' }>`
  position: absolute;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  pointer-events: none;
  background-color: ${({ type }) => (type === 'attack' ? 'red' : 'green')};
  animation: ${({ type }) =>
      type === 'attack' ? attackEffect : healEffect}
    0.5s ease-out forwards;
  z-index: 0; /* アイコンの背面に配置 */
`;

//先送り矢印表示
// 点滅アニメーション
export const blink = keyframes`
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
`;

export const MessageButton = styled.button`
  display: block;
  position: relative;
  padding: 12px 16px;
  font-size: 18px;
  width: 100%;
  border-radius: 8px;
  margin-top: 45px;

  &::after {
    content: "Click▼";              // 表示したいアイコン
    position: absolute;
    right: 8px;                 // 右下に配置
    bottom: 4px;
    font-size: 14px;
    animation: ${blink} 2s infinite; // 点滅
  }
`;

  export const Message = styled.div`
    position: relative;
    padding: 12px 16px;
    font-size: 18px;
    border-radius: 8px;
  

    color: white;
    font-size: 16px;
    border: 2px solid white;
    padding: 8px 12px;

    &::after {
      content: "▼"; 
      position: absolute;             // 表示したいアイコン
      right: 8px;                 // 右下に配置
      bottom: 4px;
      font-size: 16px;
      margin-left: 10px;
      animation: ${blink} 2s infinite; // 点滅
    }
  `;

/*メニュー全体の枠*/
export const MenuWrapper = styled.div`
  background-color: black;
  display: inline-block;
  border: 4px solid white;
  border-radius: 8px;
`;

export const SubMenu = styled.div<{ open: boolean }>`
  display: inline-block;
  vertical-align: top;
  background: black;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 50px;

  /* 横幅アニメーション */
  max-width: ${({ open }) => (open ? "300px" : "0px")};
  transition: max-width 0.5s ease-out;
`;

// 各メニューアイテム
export const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 0 white;
  
  &:hover {
    background-color: #222;
  }
  
  &:active {
    transform: translateY(1px);
  }

  &:focus {
    outline: none;      /* フォーカス枠を消す */
    box-shadow: none;   /* フォーカス時の影も消す */
  }

  /* disabled のとき */
  &:disabled {
    background-color: #302b2bff;  /* 無効時の背景色 */
    color: gray;             /* 文字色 */
    cursor: not-allowed;     /* 禁止カーソル */
    box-shadow: none;        /* 影を消す */
  }
`;

export const NormalBtn = styled.button`
  height: 50px;
  border: 4px solid white;
  border-radius: 8px;
  padding: 5px;
`;

/* 横並び */
//親
export const SideBySideContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;
//子
export const SideBySideBox = styled.div`
  padding: 8px;
`;

/*エフェクト*/
const attackEffect = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1.2); }
`;

const healEffect = keyframes`
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1.2); }
`;

