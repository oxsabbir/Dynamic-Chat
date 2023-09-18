import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
const FindFriend = function ({ getBack }) {
  return (
    <>
      <div className={classes.findSection}>
        <div className={classes.searchBar}>
          <Button onClick={getBack}>Back</Button>
          <input type="search" name="search" placeholder="Search your friend" />
        </div>
        <div className={classes.friendList}>
          <div className={classes.friendCard}>
            <img src={Glogo} />
            <h3>Sabbir Hossain</h3>
            <Button>Say Hello</Button>
          </div>
          <div className={classes.friendCard}>
            <img src={Glogo} />
            <h3>Sabbir Hossain</h3>
            <Button>Say Hello</Button>
          </div>
          <div className={classes.friendCard}>
            <img src={Glogo} />
            <h3>Sabbir Hossain</h3>
            <Button>Say Hello</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindFriend;
