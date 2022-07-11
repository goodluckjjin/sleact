import axios from "axios";
import React, { useCallback, FC } from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { Navigate } from "react-router";
import { Header } from "./styles";

const Workspace: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 10000, // 호출시간
  });

  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => mutate(false));
  }, []);

  // if (data === undefined) {
  //   return <div>로딩중...</div>;
  // }

  // if (!data) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div>
      <Header>test</Header>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
