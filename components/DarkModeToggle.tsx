import React from 'react';
import styled from 'styled-components';
import { styleMode } from '../styles/styles';

interface StyleProps {
  width?: string | number;
  height?: string | number;
}
type Element = React.HTMLAttributes<HTMLInputElement>;
interface Props extends Element, styleMode, StyleProps {}

const DarkModeToggle: React.FC<Props> = (props) => {
  const { toggleStyle, theme, width, height } = props;
  const onChangeToggle = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      toggleStyle('dark');
    } else {
      toggleStyle('light');
    }
  };

  return (
    <Toggle
      type="checkbox"
      width={width}
      height={height}
      onChange={onChangeToggle}
      checked={theme === 'dark'}
    />
  );
};

const Toggle = styled.input<StyleProps>`
  cursor: pointer;
  position: relative;
  width: ${({ width }) => (width ? width : '4rem')};
  height: ${({ height }) => (height ? height : '2rem')};
  outline: none;
  appearance: none;
  background-color: rgba(0, 154, 239, 1);
  transition: all 0.5s;
  border-radius: 1.25rem;

  &:checked {
    background-color: rgba(0 154 239, 1);
    transition: all 0.5s;
  }

  &::before {
    content: '🌞';
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    width: ${({ height }) => (height ? height : '2rem')};
    height: ${({ height }) => (height ? height : '2rem')};
    top: 0;
    left: 0;
    background-color: #ffffff;
    border-radius: 2rem;

    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.25s;
  }

  &:checked::before {
    left: ${({ height }) => (height ? height : '2rem')};
    content: '🌜';
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #555555;
  }
`;

export default DarkModeToggle;
