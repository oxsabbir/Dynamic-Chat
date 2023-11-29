import classes from "../Message.module.css";
import makeDate from "../../Feature/makeDate";
import Typing from "../../UI/Typing";
import { useState } from "react";
const TextPrinter = function ({ item, authUser, message }) {
  const [isShown, setIsShown] = useState(false);

  const dateShowHanlder = function () {
    setIsShown((prev) => !prev);
  };

  return (
    <>
      <div
        onClick={dateShowHanlder}
        className={`${
          item.from === authUser ? classes.authTextMsg : classes.textMsg
        } ${item.isTyping && item.from === authUser && classes.hidden}`}
      >
        {!item.isTyping && (
          <div>
            <p>{message}</p>
            <p className={`${isShown ? classes.dateShow : classes.dateTime}`}>
              {makeDate(item.time)}
            </p>
          </div>
        )}

        {item.isTyping && item.from !== authUser && <Typing />}
      </div>
    </>
  );
};
export default TextPrinter;
