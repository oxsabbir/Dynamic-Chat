import classes from "./Profile.module.css";
import { contextData } from "../auth/Context";
import Button from "../UI/Button/Button";
import { icons } from "../UI/Icons";
import ConfirmationBox from "../UI/Modal/ConfirmationBox";
import { useState } from "react";
import GroupMenu from "../GroupChat/GroupMenu";

const Profile = function ({
  userInfo,
  roomId,
  blockStatus,
  profilePic,
  isGroupOpen,
  roomMember,
}) {
  const { toggleProfile, isProfileShow } = contextData();
  const [isConfirm, setIsConfirm] = useState(false);
  const [job, setJob] = useState("");
  const [message, setMessage] = useState("");
  const defaultMessage = {
    unfriend:
      "You cannot undo this action. All the messages will be removed. Check twice before unfriend.",
    block:
      "Blocking friends means they can't send you message. But they can read all the old message. ",
  };

  const openIsConfirm = function (event) {
    setIsConfirm(true);
    const job = event.target.id;
    setMessage(defaultMessage[job]);
    setJob(job);
  };

  const closeConfirm = function () {
    setIsConfirm(false);
  };

  return (
    <>
      <div
        className={`${classes.profile} ${
          isProfileShow ? classes.profileShow : classes.profileHide
        }`}
      >
        <Button onClick={toggleProfile}>{icons.back}</Button>

        {isConfirm && (
          <ConfirmationBox
            message={message}
            getBack={closeConfirm}
            job={job}
            userInfo={userInfo}
            roomId={roomId}
            closeModal={closeConfirm}
          />
        )}

        <div
          className={`${classes.profileCard} ${
            !isGroupOpen ? classes.notGroup : ""
          }`}
        >
          <img src={profilePic} alt="Profile Picture" />

          <div className={classes.info}>
            <h2>{userInfo.userName}</h2>
            {!isGroupOpen && (
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                sapiente placeat tenetur eum. Inventore, esse quis consequuntur
              </p>
            )}
          </div>
          {isGroupOpen && (
            <GroupMenu memberList={roomMember} groupInfo={userInfo} />
          )}
          {!isGroupOpen && (
            <div className={classes.options}>
              {!blockStatus && (
                <Button id="block" onClick={openIsConfirm}>
                  Block
                </Button>
              )}
              <Button id="unfriend" onClick={openIsConfirm}>
                Unfriend
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Profile;
