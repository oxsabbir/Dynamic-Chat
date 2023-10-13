import classes from "./Chat.module.css";
import { Link } from "react-router-dom";

const Messages = function ({ item, authUser, profilePic }) {
  let message = item.message;
  if (item.isTyping) {
    console.log(item);
    message = item.message;
  }

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
          <div
            className={`${
              item.from === authUser ? classes.authTextMsg : classes.textMsg
            } ${item.isTyping && item.from === authUser && classes.hidden}`}
          >
            {!item.isTyping && <p>{message}</p>}
            {item.isTyping && item.from !== authUser && <p>{message}</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
