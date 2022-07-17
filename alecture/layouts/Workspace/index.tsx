import axios from "axios";
import React, { VFC, useCallback, FC, useState } from "react";
import useSWR, { BareFetcher, SWRHook } from "swr";
import fetcher from "@utils/fetcher";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import {
  Header,
  ProfileImg,
  RightMenu,
  ProfileModal,
  WorkspaceWrapper,
  Workspaces,
  WorkspaceButton,
  MenuScroll,
  Chats,
  Channels,
  WorkspaceName,
  WorkspaceModal,
  AddButton,
} from "@layouts/Workspace/styles";
import { Button, Input, Label } from "@pages/Signup/styles";
import useInput from "@hooks/useInput";
import gravatar from "gravatar";
import { toast } from "react-toastify";
import Menu from "@components/Menu";
import Modal from "@components/Modal";
import CreateChannelModal from "@components/CreateChannelModal";

import { IUser, IWorkspace } from "@typings/db";

const Workspace: FC = () => {
  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 1000, // 호출시간
  });
  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => mutate(false));
  }, []);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput("");
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput("");
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const userData = data as IUser;
  const workspaces: IWorkspace[] = userData?.Workspaces;

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
    console.log("hi");
  }, []);

  const onCloseUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e: any) => {
      e.preventDefault(); // 새로고침 안되게
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          "http://localhost:3095/api/workspaces",
          { workspace: newWorkspace, url: newUrl },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace("");
          setNewUrl("");
        })
        .catch((error: any) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  // 채널 만들기
  const onClickCreateChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  if (userData === undefined) {
    return <div>로딩중...</div>;
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
            // src={gravatar?.url(data.nickname, { s: "28px", d: "retro" })}
            //  alt={`${data.nickname}`}
            />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  {/* <img
                   src={gravatar.url(data.nickname, { s: "36px", d: "retro" })} 
                   /> */}
                </ProfileModal>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>
          {workspaces.map((ws: IWorkspace) => {
            return (
              <Link key={ws.id} to={`/workspaces/${123}/channael/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickCreateChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
          </MenuScroll>
        </Channels>
        <Chats></Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      ></CreateChannelModal>
    </div>
  );
};

export default Workspace;
