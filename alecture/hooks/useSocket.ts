import io from "socket.io-client";
import { useCallback } from "react";

const backUrl = "http://localhost:3095";
const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  // workspace가 없는지 체크하는게 우선이여도, disconnect가 위에 있어도 에러가 될 때,
  // js 스코프 개념을 필요
  // const disconnect = sockets[workspace].disconnect();
  // if(!workspace) return [undefined, disconnect];
  // console.log("render", workspace);
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, []);

  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ["websocket"],
    });
  }
  sockets[workspace].on("message", (data: any) => {
    // console.log(data);
  });
  sockets[workspace].on("data", (data: any) => {
    // console.log(data);
  });
  sockets[workspace].on("onlineList", (data: any) => {
    // console.log(data);
  });

  // console.log("sockets[workspace]", sockets[workspace]);
  // console.log("disconnect", disconnect);

  return [sockets[workspace], disconnect];
};

export default useSocket;
