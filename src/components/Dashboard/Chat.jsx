import Button from "../UI/Button";
import classes from "./Chat.module.css";
import Glogo from "../../assets/Glogo.png";
const Chat = function () {
  return (
    <>
      <div className={classes.chatBody}>
        <div className="top">
          <div className={classes.friendCard}>
            <img src={Glogo} />
            <h3>Sabbir Hossain</h3>
            <Button>Profile</Button>
          </div>
        </div>
        <div className={classes.message}>
          <div className={classes.otherUser}>
            <img src={Glogo} />
            <div className={classes.textMsg}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              totam ut mollitia asperiores. Sunt, reiciendis temporibus
              exercitationem a similique inventore porro commodi dolor,
              accusamus nostrum deserunt rerum. Quidem, minus! Quis!
            </div>
          </div>

          <div className={classes.authUser}>
            <div className={classes.authTextMsg}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              totam ut mollitia asperiores. Sunt, reiciendis temporibus
              exercitationem a similique inventore porro commodi dolor,
              accusamus nostrum deserunt rerum. Quidem, minus! Quis!
            </div>
          </div>
        </div>
        <div className={classes.bottomOption}>
          <Button>More</Button>
          <input type="text" placeholder="Write here" />
          <Button>Send</Button>
        </div>
      </div>
    </>
  );
};

export default Chat;
