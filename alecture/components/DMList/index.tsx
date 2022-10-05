// import { CollapseButton } from '@components/DMList/styles';
import EachDM from "@components/EachDM";
import useSocket from "@hooks/useSocket";
import { IUser, IUserWithOnline } from "@typings/db";
import fetcher from "@utils/fetcher";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import { CollapseButton } from "./styles";

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on("onlineList", (data: number[]) => {
      // console.log("DMList onlineList", data);
      setOnlineList(data);
    });
    // socket?.on('dm', onMessage);
    // console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      // socket?.off('dm', onMessage);
      // console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off("onlineList");
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member: IUserWithOnline) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
