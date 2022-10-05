import React from "react";
import { IChannel } from "@typings/db";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";

interface EachChannelProps {
  channel: IChannel;
  IsCurrentChannel: boolean;
}

const EachChannel = ({ channel, IsCurrentChannel }: EachChannelProps) => {
  const { workspace } = useParams<{ workspace?: string }>();

  return (
    <NavLink
      key={channel.name}
      className={IsCurrentChannel ? "selected" : ""}
      to={`/workspace/${workspace}/channel/${channel.name}`}
    >
      <span># {channel.name}</span>
    </NavLink>
  );
};

export default EachChannel;
