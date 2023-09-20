import Button from "../UI/Button";
import classes from "./Chat.module.css";
import Glogo from "../../assets/Glogo.png";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import ListPrinter from "../UI/ListPrinter";
import { push, child, set, query, limitToLast } from "firebase/database";

const Chat = function ({ roomId }) {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  const [message, SetMessage] = useState(null);
  const enteredMessage = useRef();
  const scrollElement = useRef();

  const scrollIntoViews = () => {
    scrollElement.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    const db = getDatabase();

    const dbRef = query(ref(db, "chat-room/" + roomId), limitToLast(15));

    onValue(dbRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      const mainData = Object.values(data);
      SetMessage(mainData);
    });
  }, [roomId]);

  console.log(message);

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
      <div className={classes.chatBody}>
        <div className="top">
          <div className={classes.friendCard}>
            <img src={Glogo} />
            <h3>Sabbir Hossain</h3>
            <Button>Profile</Button>
          </div>
        </div>
        <div className={classes.message}>
          <ListPrinter>
            {message &&
              message.map((item, i) => {
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
            <Button>More</Button>
            <input ref={enteredMessage} type="text" placeholder="Write here" />
            <Button type={"submit"}>Send</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
