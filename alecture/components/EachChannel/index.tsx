import React, { useEffect } from "react";
import { IChannel, IUser } from "@typings/db";
import { useParams } from "react-router";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import fetcher from "@utils/fetcher";
import useSWR from "swr";

interface EachChannelProps {
  channel: IChannel;
}

const EachChannel = ({ channel }: EachChannelProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    // userData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    userData
      ? `http://localhost:3095/api/workspaces/${workspace}/channels/${channel?.name}/unreads?after=${date}`
      : null,
    fetcher,
  );
  // channel active css start
  const seperatedPathName = location.pathname.split("/");
  const currentChannelName = decodeURI(seperatedPathName[seperatedPathName.length - 1]);
  // channel active css start

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, channel]);

  return (
    <NavLink
      key={channel.name}
      to={`/workspace/${workspace}/channel/${channel.name}`}
      className={() => (currentChannelName === channel.name ? "selected" : "")}
    >
      <span className={count !== undefined && count > 0 ? "bold" : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
};

export default EachChannel;
