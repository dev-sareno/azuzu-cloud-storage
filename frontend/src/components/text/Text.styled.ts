import styled from "styled-components";

interface IRootProps {
  align: 'left' | 'center' | 'right';
  size?: 'xs' | 'small' | 'normal' | 'large' | 'xl'
}

export const Root = styled.div<IRootProps>`
  text-align: ${p => p.align};
  font-size: ${p => ({
    'xs': '12px',
    'small': '16px',
    'normal': '18px',
    'large': '24px',
    'xl': '30px',
  }[p.size || 'normal'])};
`;