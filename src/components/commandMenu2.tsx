import * as React from 'react'
import styled, { keyframes } from 'styled-components';
 
const { useState, useEffect , useRef} = React

// ドットフォント用
const MenuWrapper = styled.div`
  padding: 16px;
  display: inline-block;
  border: 4px solid white;
  border-radius: 8px;
  outline: none;
`;

// selected prop 用の型を定義
interface MenuItemProps {
  selected?: boolean;
}

const MenuItem = styled.div<MenuItemProps>`
  padding: 4px 8px;
  margin: 4px 0;
  display: flex;
  align-items: center;
`;

const blink = keyframes`
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
`;

const Cursor = styled.div`
  width: 16px;
  margin-right: 8px;
  animation: ${blink} 1s infinite;
`;

const menuOptions = ['AA', '画面', 'ファイア', 'にげる'];

export const DQMenu: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev + 1) % menuOptions.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
    } else if (e.key === 'Enter') {
      alert(`選択: ${menuOptions[selectedIndex]}`);
    }
  };
  
  return (
    <MenuWrapper tabIndex={0} ref={menuRef} onKeyDown={handleKeyDown}>
      {menuOptions.map((option, index) => (
        <MenuItem key={option} selected={index === selectedIndex}>
          {index === selectedIndex ? <Cursor>▶</Cursor> : <span style={{ width: '16px' }} />}
          {option}
        </MenuItem>
      ))}
    </MenuWrapper>
  );
}
