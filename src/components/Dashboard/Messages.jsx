import classes from "./Chat.module.css";
import Glogo from "../../assets/Glogo.png";

const Messages = function ({ item, authUser }) {
  return (
    <>
      <div
        className={
          item.from === authUser ? classes.authUser : classes.otherUser
        }
      >
        {item.from !== authUser && <img src={Glogo} />}

        <div
          className={
            item.from === authUser ? classes.authTextMsg : classes.textMsg
          }
        >
          {item.image && (
            <div className={classes.imageFile}>
              <img src={item.image} />
            </div>
          )}

          <p>{item.message}</p>
        </div>
      </div>
    </>
  );
};

export default Messages;
