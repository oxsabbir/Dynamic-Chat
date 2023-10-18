import classes from "./Message.module.css";
import { Link } from "react-router-dom";
import { getDatabase, ref, update } from "firebase/database";

const Messages = function ({ item, authUser, profilePic, roomId }) {
  let message = item.message;
  if (item.isTyping) {
    message = item.message;
  }

  let date = new Date(item.time);
  const printedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  const messageDeleteHandler = async function (event) {
    // room id , message id ,
    const messageId = event.target.id;
    const db = getDatabase();
    const updates = {};
    updates[`chat-room/${roomId}/chats/${messageId}`] = null;
    console.log(updates);
    return update(ref(db), updates)
      .then(() => console.log("success"))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div
        className={
          item.from === authUser ? classes.authUser : classes.otherUser
        }
      >
        {item.from !== authUser && <img src={profilePic} />}

        {item.image && (
          <div
            className={`${
              item.from === authUser
                ? classes.imageFileAuth
                : classes.imageFileOther
            } ${classes.imageFile}`}
          >
            <Link to={item.image} target="blank">
              <img src={item.image} loading="lazy" />
            </Link>
            {item.message && (
              <p
                className={`${
                  item.from === authUser ? classes.authTextMsg : classes.textMsg
                } ${classes.textFull}`}
              >
                {item.message}
              </p>
            )}
          </div>
        )}

        {!item.image && (
          <>
            <div
              className={`${
                item.from === authUser ? classes.authTextMsg : classes.textMsg
              } ${item.isTyping && item.from === authUser && classes.hidden}`}
            >
              {!item.isTyping && <p>{message}</p>}
              {item.isTyping && item.from !== authUser && <p>{message}</p>}
            </div>
          </>
        )}

        {item.from === authUser && (
          <div
            id={item.id}
            onClick={messageDeleteHandler}
            className={classes.moreOption}
          >
            <i id={item.id} className="fa-solid fa-trash"></i>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
