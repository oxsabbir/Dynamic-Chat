import { useContext, useEffect, useState } from "react";
import classes from "./Inbox.module.css";
import Glogo from "../../assets/Glogo.png";
import {
  getDatabase,
  query,
  ref,
  onValue,
  limitToLast,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { stateContext } from "../auth/Context";

const LastMessage = function ({ item, chatHandler, uid }) {
  const { activeChat } = useContext(stateContext);
  console.log(activeChat);
  const auth = getAuth();

  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const lastMessageRef = query(
      ref(db, "chat-room/" + `${item.roomId}/chats`),
      limitToLast(1)
    );

    onValue(lastMessageRef, (snap) => {
      if (!snap.exists()) return;
      const lastMessage = snap.val();
      const [rawMessage] = Object.values(lastMessage);
      setLastMessage(rawMessage);
    });
  }, [item.roomId]);

  return (
    <div
      id={item.roomId}
      data-test={item.userId}
      onClick={chatHandler}
      className={`${classes.friendCard} ${
        activeChat === item.userId ? classes.active : ""
      }`}
    >
      <img src={Glogo} />
      <div>
        <h3>{item.name}</h3>
        <p
          className={`${classes.message} ${
            lastMessage.from !== uid ? classes.bolder : ""
          }`}
        >
          {lastMessage.message}
        </p>
      </div>
      <div className={`${lastMessage.from !== uid ? classes.dot : ""}`}></div>
    </div>
  );
};

export default LastMessage;
