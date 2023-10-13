import Button from "../UI/Button";
import classes from "./Chat.module.css";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as imageRef } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import ListPrinter from "../UI/ListPrinter";
import { push, child, query, limitToLast, get } from "firebase/database";
import { icons } from "../UI/Icons";
import { contextData } from "../auth/Context";
import Messages from "./Messages";
import Profile from "./Profile";
import defaultProfile from "../../assets/defaultProfile.jpg";

import { blockFriend } from "../Friend/manageFriend";
import uploadMedia from "../UploadMedia";
import { messagesSender as sendMsg } from "../MessageSender";
import { update } from "firebase/database";

const Chat = function ({ roomId, userId }) {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  const { toggleInbox, isInboxOpen, toggleProfile } = contextData();
  const [message, SetMessage] = useState([]);
  const [userInfo, setUserInfo] = useState("NoName");
  const [loadCount, setLoadCount] = useState(20);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blocked, setBlocked] = useState({});

  const enteredMessage = useRef();
  const enteredFile = useRef();
  const scrollElement = useRef();

  const scrollIntoViews = () => {
    scrollElement.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // doesn't need anymore
  useEffect(() => {
    const userRef = ref(getDatabase());
    get(child(userRef, `users/${userId}`))
      .then((snaps) => {
        if (snaps.exists()) {
          const data = snaps.val();
          setUserInfo(data);
        }
      })
      .catch((error) => console.log(error));
  }, [userId]);

  // room Id can came from other side
  useEffect(() => {
    const db = getDatabase();
    const chatRef = query(
      ref(db, "chat-room/" + `${roomId}/chats`),
      limitToLast(loadCount)
    );

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
    scrollIntoViews();
  }, [roomId, loadCount]);

  const messageSender = async function (
    roomId,
    currentUserId,
    userId,
    message,
    newKey,
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
      ]);
    }
    // Sending only text message without image
    if (!isImageSelected) {
      messageSender(roomId, auth.currentUser.uid, userId, message, newKey);
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
        <div className={classes.message}>
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
                return (
                  <li key={i}>
                    <Messages
                      item={item}
                      authUser={authUser}
                      profilePic={profilePic}
                      roomId={roomId}
                    />
                  </li>
                );
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
