import React, { useCallback, useRef } from "react";
import Workspace from "@layouts/Workspace";
import { Container, Header, DragOver } from "@pages/DirectMessage/styles";
import gravatar from "gravatar";
import useSWR, { mutate } from "swr";
import useSWRInfinite from "swr/infinite";
import fetcher from "@utils/fetcher";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { useParams } from "react-router";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from "@typings/db";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR("http://localhost:3095/api/users", fetcher);
  const [chat, onChangeChat, setChat] = useInput("");
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1].length < 20) || false;

  const scrollRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(
            `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then(() => {
            mutateChat();
            setChat("");
          })
          .catch(console.error);
      }
    },
    [chat],
  );
  // chatData?.reverse()
  // concat(...chatData).reverse()
  // [...chatData].reverse()
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  if (!userData || !myData) return null;
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: "24px", d: "retro" })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
