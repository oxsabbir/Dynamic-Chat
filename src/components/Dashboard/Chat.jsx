import Button from "../UI/Button";
import classes from "./Chat.module.css";
import Glogo from "../../assets/Glogo.png";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import ListPrinter from "../UI/ListPrinter";
import { push, child, set, query, limitToLast, get } from "firebase/database";
import { icons } from "../UI/Icons";
import { stateContext } from "../auth/Context";
import { useContext } from "react";

const Chat = function ({ roomId, userId }) {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  const { toggleInbox, isInboxOpen } = useContext(stateContext);

  const [message, SetMessage] = useState(null);
  const [userInfo, setUserInfo] = useState("NoName");
  const [loadCount, setLoadCount] = useState(20);

  const enteredMessage = useRef();
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
      ref(db, "chat-room/" + roomId),
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

  const sendMessage = function (event) {
    event.preventDefault();

    const db = getDatabase();
    const message = enteredMessage.current?.value;

    if (message.trim().length <= 0) {
      enteredMessage.current.focus();
      return;
    }

    // generating new key for message
    const newKey = push(child(ref(db), "friends/")).key;

    set(ref(db, "chat-room/" + roomId + `/${newKey}`), {
      from: authUser,
      names: auth?.currentUser?.displayName,
      message: message,
    })
      .then(() => {
        enteredMessage.current.value = "";
        scrollIntoViews();
      })
      .catch((err) => console.log(err));
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
          <Button onClick={() => setLoadCount((prev) => prev + 20)}>
            Load More
          </Button>
          <ListPrinter>
            {message &&
              message.map((item, i) => {
                if (message.length - 1 === i) {
                  scrollIntoViews();
                }
                return (
                  <li key={i}>
                    <div
                      className={
                        item.from === authUser
                          ? classes.authUser
                          : classes.otherUser
                      }
                    >
                      {item.from !== authUser && <img src={Glogo} />}
                      <div
                        className={
                          item.from === authUser
                            ? classes.authTextMsg
                            : classes.textMsg
                        }
                      >
                        {item.message}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ListPrinter>
          <div className={classes.scroller} ref={scrollElement}></div>
        </div>
        <form onSubmit={sendMessage}>
          <div className={classes.bottomOption}>
            <Button>{icons.image}</Button>
            <input ref={enteredMessage} type="text" placeholder="Write here" />
            <Button type={"submit"}>{icons.send}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
