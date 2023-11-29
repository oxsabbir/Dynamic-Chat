import classes from "./Message.module.css";
import TextPrinter from "./mediaPrinter/TextPrinter";
import ImagePrinter from "./mediaPrinter/imagePrinter";
import VoicePrinter from "./mediaPrinter/VoicePrinter";

const Messages = function ({
  item,
  authUser,
  profilePic,
  deleteHandler,
  sameUser,
}) {
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
          className={`${
            item.from === authUser ? classes.authUser : classes.otherUser
          } ${sameUser ? classes.sameUser : ""}`}
        >
          {item.from !== authUser && !sameUser && <img src={profilePic} />}

          {item.image && <ImagePrinter item={item} authUser={authUser} />}

          {!item.image && !item.voice && (
            <TextPrinter authUser={authUser} item={item} message={message} />
          )}

          {item.voice && <VoicePrinter authUser={authUser} item={item} />}

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

export default Messages;
