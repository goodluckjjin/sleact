import axios from "axios";
import React, { useCallback, FC } from "react";
import useSWR from "swr";

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 10000, // 호출시간
  });

  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => mutate());
  }, []);
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
