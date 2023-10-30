import classes from "./Setting.module.css";
import Button from "./UI/Button";
import { contextData } from "./auth/Context";
import { icons } from "./UI/Icons";
import DangerButton from "./UI/DangerButton";
import { useRef, useState } from "react";
import { updateName, updatePhoto } from "./UpdateSetting";
import { update, ref, getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SideLayout from "./Layout/SideLayout";

const Setting = function ({ userInfo }) {
  const { toggleSetting, isSettingOpen, setLogOut } = contextData();
  const [isSelected, setIsSelected] = useState(false);
  const [nameChanging, setNameChanging] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

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

  const logOutHandler = function () {
    auth.signOut().then(() => setLogOut());
    navigate("/");
  };

  return (
    <>
      <SideLayout
        title={"Setting"}
        backHandler={toggleSetting}
        isShown={isSettingOpen}
      >
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
            corrupti atque deserunt
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
            <DangerButton onClick={logOutHandler}>Logout</DangerButton>
          </div>
        </div>
      </SideLayout>
    </>
  );
};

export default Setting;
