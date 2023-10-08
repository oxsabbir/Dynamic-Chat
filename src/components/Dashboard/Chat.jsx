import Button from "../UI/Button";
import classes from "./Chat.module.css";
import Glogo from "../../assets/Glogo.png";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  serverTimestamp,
  update,
} from "firebase/database";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref as imageRef,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import ListPrinter from "../UI/ListPrinter";
import { push, child, set, query, limitToLast, get } from "firebase/database";
import { icons } from "../UI/Icons";
import { contextData } from "../auth/Context";
import Messages from "./Messages";
import Profile from "./Profile";

import { blockFriend } from "../Friend/manageFriend";

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
      scrollIntoViews();

      console.log(mainData[mainData.length - 1].blocked);

      if (mainData[mainData.length - 1].blocked) {
        console.log("wow");
        setBlocked(mainData[mainData.length - 1]);
      } else {
        setBlocked({});
      }
    });
  }, [roomId, loadCount]);

  const messageSender = async function (
    roomId,
    currentUserId,
    userId,
    message,
    newKey,
    imageUrl
  ) {
    const db = getDatabase();

    const messages = {
      from: authUser,
      names: auth?.currentUser?.displayName,
      message: message,
      time: serverTimestamp(),
    };
    if (imageUrl) {
      console.log(imageUrl);
      messages.image = imageUrl;
    }

    const updates = {};
    // updating timestamps on the both side for the sorting
    // these two update are for sorting inbox card
    updates[`users/${currentUserId}/friends/${roomId}/lastSent`] =
      serverTimestamp();
    updates[`users/${userId}/friends/${roomId}/lastSent`] = serverTimestamp();

    updates["chat-room/" + roomId + `/chats/${newKey}`] = messages;
    // updates["chat-room/" + roomId + "/createdAt"] = serverTimestamp();
    return update(ref(db), updates).then(() => {
      enteredMessage.current.value = "";
      enteredMessage.current.focus();
      enteredFile.current.value = "";
      setIsImageSelected(false);
      scrollIntoViews();
    });
  };

  const sendMessage = function (event) {
    console.log("Trigger");

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

    if (isImageSelected) {
      setIsLoading(true);
      console.log("selected already");
      const file = enteredFile.current.files[0];
      const storage = getStorage();
      const picRef = imageRef(
        storage,
        `image/${roomId}/${auth.currentUser.uid}/${newKey}`
      );

      const uploadTask = uploadBytesResumable(picRef, file, {
        contentType: file.type,
      });
      uploadTask.on(
        "state_changed",
        (snaps) => {
          const progess = (snaps.bytesTransferred / snaps.totalBytes) * 100;
          console.log(progess);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            console.log(downloadUrl);
            messageSender(
              roomId,
              auth.currentUser.uid,
              userId,
              message,
              newKey,
              downloadUrl
            );
            setIsLoading(false);
            return;
          });
        }
      );
    }
    console.log("still coming");
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
    console.log(enteredFile);
  };

  const unBlockHandler = function () {
    const blockId = blocked.blockId;
    console.log(roomId, blockId);
    blockFriend(roomId, "unblock", blockId);
  };

  const isBlockedFromMe = blocked.from === authUser;

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
        />

        <div className="top">
          <div className={classes.friendCard}>
            <Button onClick={toggleInbox} className={classes.backBtn}>
              {icons.back}
            </Button>
            <img src={Glogo} />
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
                    <Messages item={item} authUser={authUser} />
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
                placeholder="Write here"
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
