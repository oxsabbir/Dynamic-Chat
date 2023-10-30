import { useEffect, useState } from "react";
import classes from "./Inbox.module.css";
import Glogo from "../../assets/Glogo.png";
import {
  getDatabase,
  query,
  ref,
  onValue,
  limitToLast,
} from "firebase/database";
import { contextData } from "../auth/Context";

const LastMessage = function ({ item, uid }) {
  const {
    activeChat,
    toggleActiveUser,
    toggleInbox,
    toggleActiveChat,
    toggleChatBox,
  } = contextData();
  const [lastMessage, setLastMessage] = useState("");
  const [userInfo, setUserInfo] = useState("");

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

    // getting profile data
    const userInfoRef = ref(db, `users/${item.userId}`);
    onValue(userInfoRef, (snap) => {
      if (!snap.exists) return;
      const data = snap.val();
      if (data) {
        setUserInfo(data);
      }
    });
  }, [item.roomId]);

  const openChatHandler = function (event) {
    const userId = event.target.id;
    toggleInbox();
    toggleActiveChat(userId);
    toggleChatBox(true);
    toggleActiveUser(userInfo);
  };

  return (
    <div
      id={item.roomId}
      data-test={item.userId}
      onClick={openChatHandler}
      className={`${classes.friendCard} ${
        activeChat === item.roomId ? classes.active : ""
      }`}
    >
      <img src={userInfo.profilePic} />
      <div>
        <h3>{userInfo.userName}</h3>
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
