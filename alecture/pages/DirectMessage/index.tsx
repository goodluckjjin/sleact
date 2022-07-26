import React, { useCallback } from "react";
import Workspace from "@layouts/Workspace";
import { Container, Header, DragOver } from "@pages/DirectMessage/styles";
import gravatar from "gravatar";
import useSWR, { mutate } from "swr";
import fetcher from "@utils/fetcher";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { useParams } from "react-router";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from "@typings/db";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR("http://localhost:3095/api/users", fetcher);
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
  );
  const [chat, onChangeChat, setChat] = useInput("");
  const onSubmitForm = useCallback(
    (e: any) => {
      console.log("onSubmitForm", e);
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat("");
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  if (!userData || !myData) return null;
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: "24px", d: "retro" })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
        <span>hiiii</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
