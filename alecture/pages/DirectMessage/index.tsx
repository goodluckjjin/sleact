import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, DragOver, Header } from "@pages/DirectMessage/styles";
import gravatar from "gravatar";
import useSWR, { mutate } from "swr";
import useSWRInfinite from "swr/infinite";
import fetcher from "@utils/fetcher";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import useInput from "@hooks/useInput";
import axios from "axios";
import { IDM } from "@typings/db";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";
import useSocket from "@hooks/useSocket";

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

  // 현재 화면에서 메시지 수신 시 안 읽은 메시지 수 0으로 업데이트
  const location = useLocation();
  const date = localStorage.getItem(`${workspace}-${id}`) || 0;
  const { data: count, mutate: mutateCount } = useSWR<number>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/unreads?after=${date}` : null,
    fetcher,
  );

  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1].length < 20) || false;

  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);
  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        // Optimistic UI : 사용성 향상
        // 가짜데이터를 먼저 넣어줌으로써 화면상 렌더가 빠르게 이루어지는 것처럼 속임
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
          setChat("");
          scrollbarRef.current?.scrollToBottom();
        });
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
            localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());

            mutateChat();
          })
          // .catch(console.error);
          .catch((e) => {
            console.log("여기서 에러? ", e);
          });
      }
    },

    [chat, chatData, myData, userData, workspace, id],
  );

  const onMessage = useCallback((data: IDM) => {
    console.log("onMessage실행");
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
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
        if (location.pathname === encodeURI(`/workspace/${workspace}/dm/${id}`)) {
          console.log("working?   2");
          mutateCount(0);
        }
      });
    }
  }, []);

  useEffect(() => {
    socket?.on("dm", onMessage);
    console.log("소켓 열림");
    return () => {
      socket?.off("dm", onMessage);
      console.log("소켓 닫힘");
    };
  }, [socket, onMessage]);

  useEffect(() => {
    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
  }, [workspace, id]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

  useEffect(() => {
    console.log("working?   1");

    if (location.pathname === encodeURI(`/workspace/${workspace}/dm/${id}`)) {
      console.log("working?   2");
      mutateCount(0);
    }
  }, [mutateChat, mutateCount, location.pathname, workspace, id]);

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
      .post(`http://localhost:3095/api/workspaces/${workspace}/dms/${id}/images`, formData, {
        withCredentials: true,
      })
      .then(() => {
        localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());

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

  // chatData?.reverse()
  // concat(...chatData).reverse()
  // [...chatData].reverse()
  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);
  console.log("chatData", chatData?.[0]);
  if (!userData || !myData) return null;
  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <img src={gravatar.url(userData.email, { s: "24px", d: "retro" })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default DirectMessage;
