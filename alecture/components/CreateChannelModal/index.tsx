import React, { FC, useCallback } from "react";
import { Button, Input, Label } from "@pages/Signup/styles";
import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import axios from "axios";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import useSWR from "swr";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 1000, // 호출시간
  });
  const userData = data as IUser;

  const { data: data2, mutate: mutateChannel } = useSWR(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const channelData = data2 as IChannel;

  const onCreateChannel = useCallback(
    (e: any) => {
      e.preventDefault();
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          { name: newChannel },
          { withCredentials: true },
        )
        .then(() => {
          mutateChannel(); // 생성 후 채널 리스트 다시 불러오기
          // setShowCreateChannelModal(false);
          onCloseModal();
          setNewChannel("");
        })
        .catch((error: any) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newChannel],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
