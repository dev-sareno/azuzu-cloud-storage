import styled from "styled-components";
import { Color } from "../../contants/app.constant";

export const Root = styled.div`
  padding: 20px;
  
  & .tab-btn {
    padding: 5px 10px;
    color: ${Color.BLACK};
    border: 1px solid ${Color.PRIMARY};
  }
  
  & .tab-btn-selected {
    background-color: ${Color.PRIMARY};
    color: ${Color.WHITE};
  }

  & .tab-btn:hover {
    cursor: pointer;
  }
`;