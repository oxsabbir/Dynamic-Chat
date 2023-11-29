import classes from "../Chat/Chat.module.css";
import { contextData } from "../auth/Context";
import { icons } from "../UI/Icons";
import Button from "../UI/Button/Button";

const ProfileMenu = function ({ activeTime, profilePic, userInfo }) {
  const { toggleInbox, toggleProfile } = contextData();

  return (
    <>
      <div className={classes.top}>
        <div className={classes.friendCard}>
          <Button onClick={toggleInbox} className={classes.backBtn}>
            {icons.back}
          </Button>

          <img
            className={activeTime === "Active now" ? classes.profileActive : ""}
            src={profilePic}
          />

          <div className={classes.profileName}>
            <h3>{userInfo.userName}</h3>
            <p>{activeTime}</p>
          </div>
          <Button onClick={toggleProfile}> Profile</Button>
        </div>
      </div>
    </>
  );
};
export default ProfileMenu;
