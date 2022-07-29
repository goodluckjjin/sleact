import React, { useCallback, useRef, VFC, forwardRef } from "react";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from "react-custom-scrollbars";
interface Props {
  chatSections?: { [key: string]: IDM[] } | undefined;
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

// Channel, DM 함께 사용됨
const ChatList: VFC<Props> = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  // 리버스 인피니티 스크롤 기능
  const onScroll = useCallback((values: any) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      console.log("가장 위");
      setSize((preSize: number) => preSize + 1).then(() => {});
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
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
});

export default ChatList;
