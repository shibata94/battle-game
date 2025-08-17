import styled, { keyframes } from 'styled-components'

// 上下に揺れるアニメーション
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }  // 上に移動
  100% { transform: translateY(0); }
`;

export const IconImg = styled.img`
  width: 64px;
  height: 64px;
  animation: ${float} 1.5s ease-in-out infinite; // 無限ループ
`;

//先送り矢印表示
// 点滅アニメーション
const blink = keyframes`
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
`;

export const MessageButton = styled.button`
  position: relative;  // 擬似要素を相対配置
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
  display: block;
  border-radius: 8px;

  &::after {
    content: "▼";              // 表示したいアイコン
    position: absolute;
    right: 8px;                 // 右下に配置
    bottom: 4px;
    font-size: 14px;
    animation: ${blink} 2s infinite; // 点滅
  }
`;

export const Message = styled.div`
  position: relative;  // 擬似要素を相対配置
  padding: 12px 16px;
  font-size: 16px;
  display: block;
  border: 2px solid white;
  border-radius: 8px;
  }
`;

/*メニュー全体の枠*/
export const MenuWrapper = styled.div`
  background-color: black;
  display: inline-block;
  border: 4px solid white;
  border-radius: 8px;
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

/* 横並び */
//親
export const SideBySideContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2列に分ける */
  gap: 16px;
`;
//子
export const SideBySideBox = styled.div`
  padding: 8px;
`;
