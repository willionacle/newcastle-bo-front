import { socket } from "@/api/socket";
import { useEffect, useState } from "react";
import DepositAudio from "@/assets/audio/deposit.wav";
import WithdrawAudio from "@/assets/audio/withdraw.wav";
import UserAudio from "@/assets/audio/user.wav";
import { Howl } from "howler";
import useUserStore from "@/store/user.store";

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    function onConnect() {
      console.log("socket connected");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("socket disconnected");
      setIsConnected(false);
    }

    socket.auth = { token };
    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("DEPOSIT", (data) => {
      const sound = new Howl({
        src: [DepositAudio],
      });
      sound.play();
      console.log(data);
    });

    socket.on("WITHDRAWAL", (data) => {
      const sound = new Howl({
        src: [WithdrawAudio],
      });
      sound.play();
      console.log(data);
    });

    socket.on("USER", (data) => {
      console.log("user created!");
      const sound = new Howl({
        src: [UserAudio],
      });
      sound.play();
      console.log(data);
    });

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("DEPOSIT");
      socket.off("WITHDRAWAL");
      socket.off("USER");
    };
  }, [token]);

  return { isConnected };
};

export default useSocket;
