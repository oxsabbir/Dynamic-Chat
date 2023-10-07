import classes from "./Chat.module.css";
import Glogo from "../../assets/Glogo.png";
import { Link } from "react-router-dom";

const Messages = function ({ item, authUser }) {
  return (
    <>
      <div
        className={
          item.from === authUser ? classes.authUser : classes.otherUser
        }
      >
        {item.from !== authUser && <img src={Glogo} />}

        {item.image && (
          <div
            className={`${
              item.from === authUser
                ? classes.imageFileAuth
                : classes.imageFileOther
            } ${classes.imageFile}`}
          >
            <Link to={item.image} target="blank">
              <img src={item.image} />
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
            className={
              item.from === authUser ? classes.authTextMsg : classes.textMsg
            }
          >
            <p>{item.message}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
