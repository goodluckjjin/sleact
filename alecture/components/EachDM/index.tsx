import React, { useEffect } from "react";
import { IUserWithOnline, IUser } from "@typings/db";
import { useParams } from "react-router";
import { NavLink, useLocation } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

interface EachDMProps {
  member: IUserWithOnline;
  isOnline: boolean;
}

const EachDM = ({ member, isOnline }: EachDMProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });

  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  console.log("count", count);

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dms/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

  console.log("isOnline", isOnline);
  return (
    <NavLink
      key={member.id}
      className={(isActive) => (isOnline && isActive ? "selected" : "")}
      to={`/workspace/${workspace}/dm/${member.id}`}
    >
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? "c-presence--active c-icon--presence-online" : "c-icon--presence-offline"
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
};

export default EachDM;
