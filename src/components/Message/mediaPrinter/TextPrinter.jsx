import classes from "../Message.module.css";

const TextPrinter = function ({ item, authUser, message }) {
  return (
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
  );
};
export default TextPrinter;
