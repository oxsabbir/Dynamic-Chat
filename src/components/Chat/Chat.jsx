import Button from "../UI/Button/Button";
import classes from "./Chat.module.css";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as imageRef } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import ListPrinter from "../UI/ListPrinter";
import { push, child, query, limitToLast, off } from "firebase/database";
import { icons } from "../UI/Icons";
import { contextData } from "../auth/Context";
import Messages from "../Message/Messages";
import Profile from "../Profile/Profile";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { blockFriend } from "../Friend/manageFriend";
import uploadMedia from "../Feature/uploadMedia";
import { messagesSender as sendMsg } from "../Message/messageSender";
import { update } from "firebase/database";
import GroupChat from "../GroupChat/GroupChat";

const Chat = function () {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  const {
    toggleInbox,
    isInboxOpen,
    toggleProfile,
    prevValue,
    togglePrevValue,
    activeUser,
    activeChat,
  } = contextData();

  const userInfo = activeUser;
  let roomId = activeChat;
  const userId = userInfo.uid;

  const [message, SetMessage] = useState([]);
  const [loadCount, setLoadCount] = useState(20);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blocked, setBlocked] = useState({});
  const [roomMember, setRoomMember] = useState([]);
  const [groupOpen, setGroupOpen] = useState(false);

  const enteredMessage = useRef();
  const enteredFile = useRef();
  const scrollElement = useRef();
  const unorderListRef = useRef();

  const scrollIntoViews = () => {
    unorderListRef.current.scrollTop = unorderListRef.current.scrollHeight;
  };

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

    onValue(chatRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      const mainData = Object.values(data);
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
    scrollIntoViews();
  }, [roomId, loadCount]);

  const messageSender = async function (
    roomId,
    currentUserId,
    userId,
    message,
    newKey,
    isGroup,
    imageUrl
  ) {
    await sendMsg(...arguments).then(() => {
      enteredMessage.current.value = "";
      enteredMessage.current.focus();
      enteredFile.current.value = "";
      setIsLoading(false);
      setIsImageSelected(false);
      scrollIntoViews();
    });
  };

  const sendMessage = async function (event) {
    event.preventDefault();
    const db = getDatabase();
    const message = enteredMessage.current?.value;
    if (message.trim().length <= 0 && !isImageSelected) {
      enteredMessage.current.focus();
      return;
    }
    // generating new key for message
    const newKey = push(child(ref(db), "friends/")).key;

    // Seding message with an image
    const file = enteredFile.current.files[0];
    const storage = getStorage();
    const picRef = imageRef(
      storage,
      `image/${roomId}/${auth.currentUser.uid}/${newKey}`
    );

    if (isImageSelected) {
      setIsLoading(true);
      // uploading pic and showing to chat
      uploadMedia(file, picRef, messageSender, [
        roomId,
        authUser,
        userId,
        message,
        newKey,
        groupOpen,
      ]);
    }
    // Sending only text message without image
    if (!isImageSelected) {
      messageSender(
        roomId,
        auth.currentUser.uid,
        userId,
        message,
        newKey,
        groupOpen
      );
    }
  };

  const openInput = function () {
    enteredFile.current.click();
  };

  const closeInput = function () {
    setIsImageSelected(false);
    enteredFile.current.value = "";
  };

  const fileSelection = function () {
    setIsImageSelected(true);
    const fileLocation = enteredFile;
  };

  const unBlockHandler = function () {
    const blockId = blocked.blockId;
    blockFriend(roomId, "unblock", blockId);
  };
  const isBlockedFromMe = blocked.from === authUser;
  let profilePic = userInfo.profilePic;
  if (!userInfo.profilePic) {
    profilePic = defaultProfile;
  }

  const typingHandler = function () {
    const db = getDatabase();
    const messages = {
      isTyping: true,
      from: authUser,
      message: "typing...",
    };
    const updates = {};

    updates["chat-room/" + roomId + `/chats/${"typing"}`] = messages;
    // updates["chat-room/" + roomId + "/createdAt"] = serverTimestamp();
    return update(ref(db), updates);
  };

  const blurHandler = function () {
    const db = getDatabase();
    const updates = {};
    updates["chat-room/" + roomId + `/chats/${"typing"}`] = null;
    // updates["chat-room/" + roomId + "/createdAt"] = serverTimestamp();
    return update(ref(db), updates);
  };

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

        <div className="top">
          <div className={classes.friendCard}>
            <Button onClick={toggleInbox} className={classes.backBtn}>
              {icons.back}
            </Button>
            <img src={profilePic} />
            <h3>{userInfo.userName}</h3>
            <Button onClick={toggleProfile}> Profile</Button>
          </div>
        </div>

        <div ref={unorderListRef} className={classes.message}>
          {message.length >= 20 && (
            <Button onClick={() => setLoadCount((prev) => prev + 20)}>
              Load More
            </Button>
          )}
          <ListPrinter>
            {message &&
              message.map((item, i) => {
                if (message.length - 1 === i) {
                  scrollIntoViews();
                }
                if (!groupOpen) {
                  return (
                    <Messages
                      key={i}
                      item={item}
                      authUser={authUser}
                      profilePic={profilePic}
                      roomId={roomId}
                    />
                  );
                }
                if (groupOpen) {
                  const profile = roomMember.find(
                    (data) => data.uid === item.from
                  );
                  const pic = profile?.profilePic;
                  return (
                    <GroupChat
                      key={i}
                      item={item}
                      authUser={authUser}
                      profilePic={pic}
                      roomId={roomId}
                    />
                  );
                }
              })}
          </ListPrinter>

          <div className={classes.scroller} ref={scrollElement}></div>
        </div>

        {blocked.blockId && (
          <div className={classes.blockedUi}>
            {isBlockedFromMe ? (
              <Button onClick={unBlockHandler}>Unblock</Button>
            ) : (
              <p>
                You can't communicate with this person anymore. <br />
                For some reason this person <span>Blocked</span> your account.
              </p>
            )}
          </div>
        )}

        <form onSubmit={sendMessage} name="message">
          <div
            className={`${classes.bottomOption} ${
              blocked.blocked ? classes.hidden : ""
            }`}
          >
            <>
              <input
                className={classes.hidden}
                ref={enteredFile}
                type="file"
                onChange={fileSelection}
                accept=".png,.jpg,.jpeg,.gif"
              />

              <Button
                onMouseUp={(e) => {
                  isImageSelected ? closeInput() : openInput();
                }}
              >
                {isImageSelected ? icons.cancel : icons.image}
              </Button>

              <input
                ref={enteredMessage}
                type="text"
                onChange={typingHandler}
                placeholder="Write here"
                onBlur={blurHandler}
              />
              <Button disabled={isLoading} type={"submit"}>
                {isLoading ? "..." : icons.send}
              </Button>
            </>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
