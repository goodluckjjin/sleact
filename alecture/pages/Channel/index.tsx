import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Header, DragOver } from "@pages/Channel/styles";
import gravatar from "gravatar";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import fetcher from "@utils/fetcher";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { useParams } from "react-router";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IChannel, IChat, IDM, IUser } from "@typings/db";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";
import useSocket from "@hooks/useSocket";
import InviteChannelModal from "@components/InviteChannelModal";

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR("http://localhost:3095/api/users", fetcher);
  const [chat, onChangeChat, setChat] = useInput("");
  const { data: channelData } = useSWR<IChannel>(
    `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}`,
    fetcher,
  );
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) =>
      `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1].length < 20) || false;
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);

  // 메시지 보내기
  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData) {
        console.log("channelData", channelData);
        // Optimistic UI : 사용성 향상
        // 가짜데이터를 먼저 넣어줌으로써 화면상 렌더가 빠르게 이루어지는 것처럼 속임
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            UserId: myData.id,
            User: myData,
            content: savedChat,
            createdAt: new Date(),
            ChannelId: channelData.id,
            Channel: channelData,
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(
            `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then(() => {
            localStorage.setItme(`${workspace}-${channel}`, new Date().getTime().toString());
            setChat("");
            if (scrollbarRef.current) {
              scrollbarRef.current.scrollToBottom();
            }
            mutateChat();
          })
          .catch(console.error);
      }
    },

    [chat, chatData, myData, channelData, workspace, channel],
  );

  // 메시지 받기
  const onMessage = useCallback(
    (data: IChat) => {
      if (
        (data.Channel.name === channel &&
          (data.content.startsWith("upload\\") || data.content.startsWith("upload/"))) ||
        data.UserId !== myData.id
      ) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [channel, myData],
  );

  useEffect(() => {
    socket?.on("message", onMessage);
    return () => {
      socket?.off("message", onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    localStorage.setItme(`${workspace}-${channel}`, new Date().getTime().toString());
  }, [workspace, channel]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

  const onDrop = useCallback((e: any) => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    const formData = new FormData();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          formData.append("image", file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        formData.append("image", e.dataTransfer.files[i]);
      }
    }
    axios
      .post(`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/images`, formData, {
        withCredentials: true,
      })
      .then(() => {
        localStorage.setItme(`${workspace}-${channel}`, new Date().getTime().toString());

        setDragOver(false);
        console.log("성공");
        mutateChat();
      })
      .catch((e) => {
        console.log("에러", e);
      });
  }, []);

  const onDragOver = useCallback((e: any) => {
    console.log("onDragOver e", e);
    // e.preventDefault();
    setDragOver(true);
  }, []);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  // chatData?.reverse()
  // concat(...chatData).reverse()
  // [...chatData].reverse()
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  if (!myData || !myData) return null;
  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      {dragOver && <DragOver>업로드!</DragOver>}
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={onClickInviteChannel}
      />
    </Container>
  );
};

export default Channel;
