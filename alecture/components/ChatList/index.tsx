import React, { useCallback, useRef, VFC, forwardRef, MutableRefObject } from "react";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IChat, IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
  chatSections?: { [key: string]: (IDM | IChat)[] } | undefined;
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
  ref: React.RefObject<Scrollbars>;
}

// Channel, DM 함께 사용됨
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, scrollRef) => {
  // 리버스 인피니티 스크롤 기능
  const onScroll = useCallback(
    (values: any) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        setSize((preSize: number) => preSize + 1).then(() => {
          //스크롤 위치 유지
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [scrollRef, isReachingEnd, setSize],
  );
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {/* Object.entries(chatSections) => 객체를 배열로 바꿈 */}
        {chatSections &&
          Object.entries?.(chatSections)?.map(([date, chats]: [string, (IDM | IChat)[]]) => {
            return (
              <Section>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat: IDM | IChat) => (
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
