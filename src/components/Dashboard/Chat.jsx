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

import { Children, useEffect, useRef, useState } from "react";
import ListPrinter from "../UI/ListPrinter";
import { push, child, set, query, limitToLast, get } from "firebase/database";
import { icons } from "../UI/Icons";
import { stateContext } from "../auth/Context";
import { useContext } from "react";
import Messages from "./Messages";

const Chat = function ({ roomId, userId }) {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  const { toggleInbox, isInboxOpen } = useContext(stateContext);
  const [message, SetMessage] = useState([]);
  const [userInfo, setUserInfo] = useState("NoName");
  const [loadCount, setLoadCount] = useState(20);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const enteredMessage = useRef();
  const enteredFile = useRef();
  const scrollElement = useRef();

  const scrollIntoViews = () => {
    scrollElement.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

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

  const linkMaker = async function (child) {
    console.log(child);
    return child;
    // upload
    // build a message with that returned link
    // send that messeage

    // build message without image
    // send to server
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

  return (
    <>
      <div
        className={`${classes.chatBody} ${
          !isInboxOpen ? classes.hidebody : ""
        }`}
      >
        <div className="top">
          <div className={classes.friendCard}>
            <Button onClick={toggleInbox} className={classes.backBtn}>
              {icons.back}
            </Button>
            <img src={Glogo} />
            <h3>{userInfo.userName}</h3>
            <Button>Profile</Button>
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

        <form onSubmit={sendMessage} name="message">
          <div className={classes.bottomOption}>
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

            <input ref={enteredMessage} type="text" placeholder="Write here" />
            <Button type={"submit"}>
              {isLoading ? icons.cancel : icons.send}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
