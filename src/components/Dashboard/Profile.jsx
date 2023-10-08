import classes from "./Profile.module.css";
import { contextData } from "../auth/Context";
import Button from "../UI/Button";
import { icons } from "../UI/Icons";
import ConfirmationBox from "../UI/ConfirmationBox";
import { useState } from "react";

const Profile = function ({ userInfo, roomId, blockStatus }) {
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
        {isConfirm && (
          <ConfirmationBox
            message={message}
            getBack={closeConfirm}
            job={job}
            roomId={roomId}
            closeModal={closeConfirm}
          />
        )}

        <Button onClick={toggleProfile}>{icons.back}</Button>
        <div className={classes.profileCard}>
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/auth-practice-c867e.appspot.com/o/image%2F-Nfxw1m1FrZKCNEPooiZ%2FJVocTP9K2lUBbTJhylRbZq2kGPp2%2F-Ng4z7Xgfrc-ZE8dyh_7?alt=media&token=b3d960b0-a752-4f27-b85a-525410836ae7"
            }
            alt="Profile Picture"
          />

          <div className={classes.info}>
            <h2>{userInfo.userName}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
              sapiente placeat tenetur eum. Inventore, esse quis consequuntur
              est enim, iste mollitia incidunt cumque repellendus dicta beatae
              ipsam ducimus ad in.
            </p>
          </div>
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
        </div>
      </div>
    </>
  );
};
export default Profile;
