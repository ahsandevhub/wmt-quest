import styled from "styled-components";

export const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  gap: 16px;
  width: 100%;
  justify-content: flex-start; /* keep items left-aligned when extra space */
`;

export const ThumbWrapper = styled.div<{ $loaded: boolean }>`
  width: 200px;
  height: 200px;
  flex: 0 0 200px; /* prevent shrinking in flex/grid contexts */
  position: relative;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Placeholder skeleton should also cover fully */
  .placeholder-cover {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
  .fade-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #fff;
    opacity: ${(p) => (p.$loaded ? 1 : 0)};
    transition: opacity 0.35s ease;
  }
`;
