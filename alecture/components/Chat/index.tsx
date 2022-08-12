import React, { VFC, memo, useMemo } from "react";
import { ChatWrapper } from "@components/Chat/styles";
import gravatar from "gravatar";
import { IChat, IDM } from "@typings/db";
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { Workspaces } from "@layouts/Workspace/styles";
import { Link, useParams } from "react-router-dom";
interface Props {
  data: IDM | IChat;
}
const BACK_URL = process.env.NODE_ENV === "development" ? "http://localhost:3095" : "http://localhost:3095";
const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const user = "Sender" in data ? data.Sender : data.User;
  console.log("data in Chat", data);

  // @[hihi](1)
  // .은 모든 글자
  // .+는 모든 글자를 한 개 이상
  // ?는 0개나 1개
  // *는 0개 이상
  // \d는 숫자를 의미
  // g는 모두찾기
  // @[hihi!](1)에서 []안에 예시
  // [+]는 최대한 많이 => hihi!
  // [+?]는 최대한 조금 => hihi
  // |는 또는을 의미, \n는 줄바꿈 의미
  // ()로 묶는 건 그루핑으로, 묶인 값이 arr[1], arr[2], ...에 추가됨

  // memo는 말단컴포넌트 캐싱할 때
  // useMemo는 hooks에서 캐싱하고 싶은 함수, 부모컴포넌트가 렌더되더라도 자식컴포넌트는 렌더될 필요 없을 때
  const result = useMemo(
    () =>
      // data.content.startsWith('upload\\?')

      data.content.startsWith("uploads\\") || data.content.startsWith("uploads/") ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          input: data.content,
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g, // id나 줄바꿈 둘 다 찾았을 때
          decorator(match, index) {
            const arr = match.match(/@\[(.+?)]\((\d+?)\)/)!; // id만 찾았을 때
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />; // 나머지(줄바꿈) 찾았을때
          },
        })
      ),
    [data.content],
  );
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: "36px", d: "retro" })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span> {dayjs(data.createdAt).format("h:mm:A")}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
