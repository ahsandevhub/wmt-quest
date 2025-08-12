import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  padding: 40px 24px;

  @media (min-width: 640px) {
    padding: 30px 40px;
  }
`;

export const LogoWrapper = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: center;

  img {
    height: 36px;
    transition: all 0.2s ease;
  }
`;

export const ErrorAlert = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 14px;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

export const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  color: #9ca3af;
`;
