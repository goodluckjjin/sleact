import styled from "@emotion/styled";

export const ChatWrapper = styled.div`
  display: flex;
  padding: 8px 20px;
  // a?.b; // optional chaning
  // a??b; // nullish coalescing
  &:hover {
    // nested selector
    background: #eee;
  }
  & .chat-img {
    display: flex;
    width: 36px;
    margin-right: 8px;
    & img {
      width: 36px;
      height: 36px;
    }
  }
`;
