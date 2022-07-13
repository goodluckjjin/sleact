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
  AddButton,
} from "@layouts/Workspace/styles";
import gravatar from "gravatar";
import Menu from "@components/Menu";
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
  const userData = data as IUser;
  const workspaces: IWorkspace[] = userData?.Workspaces;
  const onClickUSerProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);
  const onClickCreateWorkspace = useCallback(() => {}, []);

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
          <span onClick={onClickUSerProfile}>
            <ProfileImg
            // src={gravatar?.url(data.nickname, { s: "28px", d: "retro" })}
            //  alt={`${data.nickname}`}
            />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUSerProfile}>
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
          <AddButton onClick={onClickCreateWorkspace}></AddButton>
        </Workspaces>
        <MenuScroll></MenuScroll>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          MenuScroll
        </Channels>
        <Chats></Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
