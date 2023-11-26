import classes from "./Chat.module.css";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  query,
  limitToLast,
  off,
} from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { contextData } from "../auth/Context";
import Profile from "../Profile/Profile";
import defaultProfile from "../../assets/defaultProfile.jpg";
import timeGenarator from "../Feature/timeGenarator";
import Loading from "../UI/Loading/Loading";
import MessagePrinter from "../Message/MessagePrinter";
import BlockHandler from "../Message/BlockHandler";
import MessageMenu from "../Message/MessageMenu";
import ProfileMenu from "../Message/ProfileMenu";

const Chat = function () {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  const {
    isInboxOpen,
    prevValue,
    togglePrevValue,
    activeUser,
    activeChat,
    currentUserData,
  } = contextData();

  const userInfo = activeUser;
  let roomId = activeChat;
  const userId = userInfo.uid;

  const [message, SetMessage] = useState([]);
  const [loadCount, setLoadCount] = useState(20);
  const [blocked, setBlocked] = useState({});
  const [roomMember, setRoomMember] = useState([]);
  const [groupOpen, setGroupOpen] = useState(false);
  const [activeTime, setActiveTime] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);

  const getMoreMessage = function () {
    setLoadCount((prev) => prev + 20);
  };

  // observer
  useEffect(() => {
    const db = getDatabase();
    const chatRef = query(
      ref(db, "chat-room/" + `${roomId}/chats`),
      limitToLast(loadCount)
    );

    const memberRef = ref(db, "chat-room/" + `${roomId}/roomMember`);

    const unSub = onValue(memberRef, (snap) => {
      if (!snap.exists()) {
        setGroupOpen(false);
        return;
      }
      const data = snap.val();
      const mainData = Object.values(data);
      setRoomMember(mainData);
      setGroupOpen(true);
    });

    setMessageLoading(true);

    onValue(chatRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      const mainData = Object.values(data);
      setMessageLoading(false);
      SetMessage(mainData);
      if (mainData[mainData.length - 1].blocked) {
        setBlocked(mainData[mainData.length - 1]);
      } else {
        setBlocked({});
      }
    });

    if (prevValue && prevValue !== roomId) {
      const chatRef = query(
        ref(db, "chat-room/" + `${prevValue}/chats`),
        limitToLast(loadCount)
      );
      off(chatRef, undefined);
    }

    togglePrevValue(roomId);

    if (userInfo?.isActive?.isActive === false) {
      const active = timeGenarator(userInfo?.isActive?.time);
      setActiveTime(`Active ${active} ago`);
    } else if (userInfo?.isActive?.isActive) {
      setActiveTime("Active now");
    } else {
      setActiveTime("");
    }
    // useing observer

    // checking the date
  }, [roomId, loadCount]);

  const isBlockedFromMe = blocked.from === authUser;

  let profilePic = userInfo.profilePic;
  if (!userInfo.profilePic) {
    profilePic = defaultProfile;
  }

  return (
    <>
      <div
        className={`${classes.chatBody} ${
          !isInboxOpen ? classes.hidebody : ""
        }`}
      >
        <Profile
          userInfo={userInfo}
          roomId={roomId}
          blockStatus={blocked.blocked}
          profilePic={profilePic}
          isGroupOpen={groupOpen}
          roomMember={roomMember}
        />
        <ProfileMenu
          userInfo={userInfo}
          activeTime={activeTime}
          profilePic={profilePic}
        />
        {messageLoading && (
          <div className={classes.centerLoading}>
            <Loading />
          </div>
        )}
        {!messageLoading && (
          <>
            <MessagePrinter
              message={message}
              authUser={authUser}
              groupOpen={groupOpen}
              roomId={roomId}
              currentUserData={currentUserData}
              profilePic={profilePic}
              roomMember={roomMember}
              getMoreMessage={getMoreMessage}
            />
            <BlockHandler
              blocked={blocked}
              roomId={roomId}
              isBlockedFromMe={isBlockedFromMe}
            />
            <MessageMenu
              roomId={roomId}
              userId={userId}
              authUser={authUser}
              blocked={blocked}
              groupOpen={groupOpen}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Chat;
