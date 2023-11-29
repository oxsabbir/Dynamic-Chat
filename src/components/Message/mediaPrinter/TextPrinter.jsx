import classes from "../Message.module.css";
import makeDate from "../../Feature/makeDate";

const TextPrinter = function ({ item, authUser, message }) {
  return (
    <>
      <div
        className={`${
          item.from === authUser ? classes.authTextMsg : classes.textMsg
        } ${item.isTyping && item.from === authUser && classes.hidden}`}
      >
        {!item.isTyping && (
          <div>
            <p>{message}</p>
            <p className={classes.dateTime}>{makeDate(item.time)}</p>
          </div>
        )}

        {item.isTyping && item.from !== authUser && <p>{message}</p>}
      </div>
    </>
  );
};
export default TextPrinter;
