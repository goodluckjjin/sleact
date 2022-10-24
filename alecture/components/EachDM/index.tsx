import React from "react";
import { IUserWithOnline, IUser } from "@typings/db";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

interface EachDMProps {
  member: IUserWithOnline;
  isOnline: boolean;
}

const EachDM = ({ member, isOnline }: EachDMProps) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });

  // /workspaces/:workspace/dms/:id/unreads
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
    </NavLink>
  );
};

export default EachDM;
