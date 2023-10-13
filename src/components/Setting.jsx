import classes from "./Setting.module.css";
import Button from "./UI/Button";
import { contextData } from "./auth/Context";
import { icons } from "./UI/Icons";
import DangerButton from "./UI/DangerButton";
import { useRef, useState } from "react";
import { updateName, updatePhoto } from "./UpdateSetting";
import { update, ref, getDatabase } from "firebase/database";

const Setting = function ({ userInfo }) {
  const { toggleSetting, isSettingOpen } = contextData();
  const [isSelected, setIsSelected] = useState(false);
  const [nameChanging, setNameChanging] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const enteredName = useRef();
  const enteredFile = useRef();

  const updateProfilePic = function () {
    enteredFile.current.click();
  };
  const fileSelection = function () {
    console.log("selected");
    setIsSelected(true);
  };

  const cancelHandler = function () {
    enteredFile.current.value = "";
    setIsSelected(false);
  };

  const openNameInput = function () {
    setNameChanging(true);
  };

  // name changer
  const nameChangeHandler = function () {
    const enterName = enteredName.current.value;
    if (enterName.trim().length < 4) {
      setError(true);
      enteredName.current.focus();
    } else {
      setLoading(true);
      // call the function here
      updateName(userInfo.uid, enterName).then(() => {
        setNameChanging(false);
        setError(false);
        setLoading(false);
      });
    }
  };

  // Update Profile pic

  const savingToProfile = async function (theLink) {
    const db = getDatabase();
    const updates = {};
    const userId = userInfo.uid;
    updates[`users/${userId}/profilePic`] = theLink;

    return update(ref(db), updates).then(() => {
      setIsSelected(false);
      enteredFile.current.value = "";
      setLoading(false);
    });
  };

  const profilePicHandler = function () {
    setLoading(true);
    const file = enteredFile.current.files[0];
    console.log(file);
    // uploading now
    updatePhoto(file, userInfo.uid, savingToProfile);
  };

  return (
    <>
      <div
        className={`${classes.setting} ${
          isSettingOpen ? classes.settingShow : ""
        }`}
      >
        <div className={classes.settingBar}>
          <h2>Settings</h2>
          <Button onClick={toggleSetting}>{icons.back}</Button>
        </div>
        <div className={classes.settingInfo}>
          <img src={userInfo.profilePic} alt="profilePic" />
          <div className={classes.updateName}>
            {nameChanging && (
              <>
                <input
                  ref={enteredName}
                  type="text"
                  defaultValue={userInfo.userName}
                  maxLength={20}
                  min={10}
                />
                <Button onClick={nameChangeHandler}>
                  {loading ? "..." : icons.add}
                </Button>
              </>
            )}
            {!nameChanging && (
              <div className={classes.userName}>
                <h3>{userInfo.userName}</h3>
                <Button onClick={openNameInput}>{icons.edit}</Button>
              </div>
            )}
          </div>

          {error && (
            <p className={classes.errorMsg}>
              Name is too small. Must have 4 or more character
            </p>
          )}

          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            corrupti atque deserunt, eligendi qui sequi, blanditiis magnam
            sapiente dolorem itaque unde maxime placeat. Delectus, dolor eveniet
            recusandae illum libero perspiciatis?
          </p>

          <input
            className={classes.hidden}
            ref={enteredFile}
            type="file"
            onChange={fileSelection}
            accept=".png,.jpg,.jpeg,.gif"
          />

          <div className={classes.settingOptions}>
            {!isSelected ? (
              <Button onClick={updateProfilePic}>Change Profile Pic</Button>
            ) : (
              <div className={classes.uploadMenu}>
                <Button onClick={profilePicHandler}>
                  {loading ? "..." : "Upload"}
                </Button>
                <Button onClick={cancelHandler}>Cancel</Button>
              </div>
            )}

            <Button>Change Password</Button>
            <DangerButton>Delete Account</DangerButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
