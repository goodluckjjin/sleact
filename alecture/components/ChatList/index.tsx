import React, { useCallback, useRef, VFC } from "react";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
  chatSections?: { [key: string]: IDM[] } | undefined;
}

// Channel, DM 함께 사용됨
const ChatList: VFC<Props> = ({ chatSections }: Props) => {
  const scrollRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {/* Object.entries(chatSections) => 객체를 배열로 바꿈 */}
        {chatSections &&
          Object.entries?.(chatSections)?.map(([date, chats]: [string, IDM[]]) => {
            console.log("in map", date, chats);
            return (
              <Section>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat: IDM) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
