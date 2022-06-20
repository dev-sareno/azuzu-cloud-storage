import styled from "styled-components";
import { Color } from "../../contants/app.constant";

interface IRootProps {
  size: 'xs' | 'small' | 'normal';
  type: 'normal' | 'simple';
  disabled: boolean;
}

export const Root = styled.div<IRootProps>`
  text-align: center;
  border-radius: 4px;
  padding: ${p => ({
    'xs': '6px 12px',
    'small': '8px 16px',
    'normal': '10px 20px',
  }[p.size])};
  font-size: ${p => ({
    'xs': '12px',
    'small': '16px',
    'normal': '18px',
  }[p.size])};
  background-color: ${p => ({
    'normal': p.disabled ? '#70557B' : Color.PRIMARY,
    'simple': Color.WHITE,
  }[p.type])};
  color: ${p => ({
    'normal': Color.WHITE,
    'simple': p.disabled ? '#C4C4C4' : Color.BLACK,
  }[p.type])};
  border: ${p => ({
    'normal': '0',
    'simple': p.disabled ? '1px solid #C4C4C4' : '1px solid gray',
  }[p.type])};
  
  &:hover {
    cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  }
`;