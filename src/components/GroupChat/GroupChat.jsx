import classes from "../Message/Message.module.css";
import VoicePrinter from "../Message/mediaPrinter/VoicePrinter";
import ImagePrinter from "../Message/mediaPrinter/ImagePrinter";
import TextPrinter from "../Message/mediaPrinter/TextPrinter";

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

          {item.image && <ImagePrinter item={item} authUser={authUser} />}

          {!item.image && !item.voice && (
            <TextPrinter item={item} authUser={authUser} message={message} />
          )}
          {item.voice && <VoicePrinter item={item} authUser={authUser} />}

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
