import React from 'react';
import styled from 'styled-components';
import { ToggleStyle } from '../styles/styles';

interface Props extends React.HTMLAttributes<HTMLInputElement>, ToggleStyle {}

const DarkModeToggle: React.FC<Props> = (props) => {
  const { toggleStyle } = props;
  const onChangeToggle = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      toggleStyle('dark');
    } else {
      toggleStyle('light');
    }
  };
  return <Toggle type="checkbox" {...props} onChange={onChangeToggle} />;
};

const Toggle = styled.input<Props>`
  position: relative;
  width: ${({ width }) => (width ? width : '4rem')};
  height: ${({ height }) => (height ? height : '2rem')};
  outline: none;
  appearance: none;
  background-color: #ebebeb;
  transition: all 0.5s;
  border-radius: 1.25rem;

  &:checked {
    background-color: #000000;
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
    transition: all 0.5s;
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
