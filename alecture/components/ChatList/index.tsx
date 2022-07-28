import React, { VFC } from "react";
import { ChatZone, Section } from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";

interface Props {
  chatData?: IDM[];
}

// Channel, DM 함께 사용됨
const ChatList: VFC<Props> = ({ chatData }: Props) => {
  console.log("chatData", chatData);
  return (
    <ChatZone>
      {chatData?.map((chat: IDM) => (
        <Chat key={chat.id} data={chat} />
      ))}
    </ChatZone>
  );
};

export default ChatList;
