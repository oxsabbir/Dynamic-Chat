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
import { stateContext } from "../auth/Context";
import defaultProfile from "../../assets/defaultProfile.jpg";

const LastMessage = function ({ item, chatHandler, uid }) {
  const [profilePic, setProfilePic] = useState(defaultProfile);
  const { activeChat } = useContext(stateContext);
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

    // getting profile data
    const profileRef = ref(db, `users/${item.userId}/profilePic`);
    onValue(profileRef, (snap) => {
      if (!snap.exists) return;
      const data = snap.val();
      if (data) {
        setProfilePic(data);
      }
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
      <img src={profilePic} />
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
