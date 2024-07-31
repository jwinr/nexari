import styled, { keyframes, css } from "styled-components"

interface LoadingProps {
  loading: boolean
}

const loadingAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`

export const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 0 16px;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 75%;
  max-width: 75%;

  @media (max-width: 768px) {
    max-width: 100%;
    flex-basis: 100%;
  }
`

export const OrderSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  max-width: 25%;
  margin-left: 16px;
  height: auto;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 0;
    border-bottom: 1px solid #d8dee4;
  }
`

export const TitleWrapper = styled.div`
  min-height: 49px;
  width: 100%;
  margin-top: 24px;
`

export const Header = styled.h1`
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--sc-color-title);
`

export const Subtitle = styled.div<LoadingProps>`
  background-color: ${({ loading }) => (loading ? "#d6d6d6" : "initial")};
  border-radius: 6px;
  min-height: 20px;
  width: ${({ loading }) => (loading ? "200px" : "fit-content")};
  ${({ loading }) =>
    loading &&
    css`
      animation: ${loadingAnimation} 2s ease-in-out infinite;
    `}

  h1 {
    display: ${({ loading }) => (loading ? "none" : "initial")};
    font-size: 19px;
    font-weight: 700;
  }
`

export const CartContainer = styled.div<LoadingProps>`
  border-radius: 6px;
  margin-top: 16px;
  background-color: ${({ loading }) => (loading ? "#d6d6d6" : "initial")};
  height: ${({ loading }) => (loading ? "300px" : "initial")};
  ${({ loading }) =>
    loading &&
    css`
      animation: ${loadingAnimation} 2s ease-in-out infinite;
    `}
`

export const CartWrapper = styled.div`
  margin-left: initial;
  flex-basis: 100%;
  max-width: 100%;
  margin-bottom: 24px;
`