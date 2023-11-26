import classes from "../Message/Message.module.css";
import { Link } from "react-router-dom";

const GroupChat = function ({ item, authUser, profilePic, deleteHandler }) {
  let message = item.message;
  if (item.isTyping) {
    message = item.message;
  }

  let status = item.type === "status";
  let isMessage = item.message !== undefined;

  return (
    <>
      {isMessage && (
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
                    item.from === authUser
                      ? classes.authTextMsg
                      : classes.textMsg
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
              onClick={deleteHandler}
              className={classes.moreOption}
            >
              <i id={item.id} className="fa-solid fa-trash"></i>
            </div>
          )}
        </div>
      )}
      {status && (
        <div className={classes.status}>
          <p>{item.title}</p>
        </div>
      )}
    </>
  );
};

export default GroupChat;
