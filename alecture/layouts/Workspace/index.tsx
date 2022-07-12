import axios from "axios";
import React, { useCallback, FC, useState } from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import {
  Header,
  ProfileImg,
  RightMenu,
  ProfileModal,
  WorkspaceWrapper,
  Workspaces,
  MenuScroll,
  Chats,
  Channels,
  WorkspaceName,
} from "@layouts/Workspace/styles";
import gravatar from "gravatar";
import Menu from "@components/Menu";

interface DataType {
  id: Number;
  email: String;
  nickname: String;
  workspaces: [];
}

const Workspace: FC<React.PropsWithChildren<{}>> = ({ children }) => {
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

  console.log("data ============", data);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const onClickUSerProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (!data) {
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
                  <img src={gravatar.url(data.nickname, { s: "36px", d: "retro" })} />
                </ProfileModal>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>text</Workspaces>
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
