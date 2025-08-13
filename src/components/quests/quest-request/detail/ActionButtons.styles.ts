import styled from "styled-components";

export const ActionsWrap = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 768px) {
    width: 100%;
    button {
      flex: 1;
    }
  }
`;
