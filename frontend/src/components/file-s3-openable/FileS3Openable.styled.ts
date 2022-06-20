import styled, { css } from "styled-components";

interface IRootProps {
  isClickable: boolean;
}

export const Root = styled.div<IRootProps>`
  padding: 8px 5px;

  ${p => p.isClickable ? css`
    &:hover {
      background-color: #D0D3D4;
      cursor: pointer;
    }
  ` : ''}
`;

export const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
`;