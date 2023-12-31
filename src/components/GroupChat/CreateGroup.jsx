import SideLayout from "../Layout/SideLayout";
import classes from "./CreateGroup.module.css";
import ListPrinter from "../UI/ListPrinter";
import Button from "../UI/Button/Button";
import { useRef, useState } from "react";
import searchingUser from "../Friend/searchingUser";
import {
  getDatabase,
  ref,
  update,
  push,
  child,
  serverTimestamp,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { icons } from "../UI/Icons";
import { getStorage, ref as imageRef } from "firebase/storage";
import uploadMedia from "../Feature/uploadMedia";

const CreateGroup = function ({ getBack, isShown, acceptedFriend, allUser }) {
  const auth = getAuth();
  const fileRef = useRef();
  const enteredGroupName = useRef();

  const currentUserInfo = allUser.find(
    (item) => item.uid === auth.currentUser.uid
  );

  const [selectedUser, setSelectedUser] = useState([currentUserInfo]);

  const [userList, setUserList] = useState(acceptedFriend);

  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isNotice, setNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupImage, setGroupImage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const checkboxHandler = function (event) {
    const value = event.target.checked;
    const roomId = event.target.id;

    const member = allUser.find((item) => item.uid === roomId);
    if (value) {
      setSelectedUser((prev) => [...prev, member]);
    }
    if (!value) {
      setSelectedUser((prev) => prev.filter((item) => item.uid !== roomId));
    }
  };

  const inputChangeHandler = function (event) {
    const value = event.target.value;
    if (value.trim().length !== 0) {
      const data = searchingUser(acceptedFriend, value);
      setUserList(data);
    } else {
      setUserList(acceptedFriend);
    }
  };

  const selectImage = function () {
    console.log(fileRef);
    fileRef.current.click();
  };
  const imageSelectorHandler = function () {
    const imageUrl = URL.createObjectURL(fileRef.current.files[0], {
      matchMedia: "image",
    });
    setIsImageSelected(true);
    setGroupImage(imageUrl);
  };
  const imageCancel = function () {
    setIsImageSelected(false);
  };

  const createGroupHandler = async function (imageUrl) {
    const db = getDatabase();
    let newKey = push(child(ref(db), "friends/")).key;

    let groupDetails = {
      userName: enteredGroupName.current?.value,
      profilePic: imageUrl,
      createdAt: serverTimestamp(),
      roomId: newKey,
      status: "success",
      type: "group",
      admin: auth.currentUser?.uid,
    };
    const firstMessage = {
      from: auth.currentUser?.uid,
      message: "Welcome to the group everyone",
    };

    const allUser = {};

    selectedUser.forEach((item) => {
      let newKey = push(child(ref(db), "friends/")).key;
      allUser[newKey] = {
        userName: item.userName,
        profilePic: item.profilePic,
        uid: item.uid,
        id: newKey,
        time: serverTimestamp(),
      };
    });

    const updateDir = {};

    updateDir[`chat-room/${newKey}/chats/${newKey}`] = firstMessage;
    updateDir[`chat-room/${newKey}/createdAt`] = serverTimestamp();
    updateDir[`users/${auth.currentUser?.uid}/friends/${newKey}`] =
      groupDetails;
    console.log(selectedUser);
    updateDir[`chat-room/${newKey}/roomMember`] = allUser;

    selectedUser.forEach(
      (item) =>
        (updateDir[`users/${item.uid}/friends/${newKey}`] = groupDetails)
    );

    return update(ref(db), updateDir).then(() => {
      setLoading(false);
      getBack();
    });
  };

  const createGroup = async function () {
    const storage = getStorage();
    const db = getDatabase();
    const newKey = push(child(ref(db), "friends/")).key;
    const groupImageRef = imageRef(storage, `image/groupProifle/${newKey}`);
    console.log(selectedUser);

    // validation

    if (enteredGroupName.current?.value.trim().length === 0) {
      enteredGroupName.current.focus();
      setNotice(true);
      setNoticeMessage("Enter a group name first");
      return;
    }
    if (!isImageSelected) {
      setNotice(true);
      setNoticeMessage("Select a group profile picture first");
      return;
    }
    if (selectedUser.length < 3) {
      setNotice(true);
      setNoticeMessage("You must more than 2 person to continue");
      return;
    }

    setLoading(true);

    uploadMedia(
      fileRef.current.files[0],
      groupImageRef,
      createGroupHandler
    ).then(() => console.log("success"));
  };

  return (
    <>
      <SideLayout
        title={"Create Group"}
        backHandler={getBack}
        isShown={isShown}
      >
        <div className={classes.groupDetails}>
          {!isImageSelected && (
            <span onClick={selectImage}>{icons.upload}</span>
          )}
          {isImageSelected && (
            <img onClick={imageCancel} src={groupImage} alt="group-image" />
          )}
          <input
            type="file"
            required
            ref={fileRef}
            onChange={imageSelectorHandler}
          />
          <input
            type="text"
            required
            maxLength={30}
            placeholder="Enter Group Name"
            ref={enteredGroupName}
          />
        </div>

        {isNotice && <p className={classes.notice}>{noticeMessage}</p>}

        <div className={classes.searchBar}>
          <input
            type="search"
            placeholder="Type Friend Name"
            onChange={inputChangeHandler}
          />
        </div>

        <div className={classes.peopleList}>
          <ListPrinter>
            {userList.map((item) => {
              if (!item.userId) return;
              const mainItem = allUser.find(
                (mainItem) => mainItem?.uid === item.userId
              );
              const isChecked = selectedUser.find((userItem) => {
                if (userItem.uid === mainItem.uid) {
                  return true;
                } else {
                  return false;
                }
              });
              return (
                <div key={mainItem.uid} className={classes.friendCard}>
                  <img src={mainItem.profilePic} />
                  <h3>{mainItem.userName}</h3>
                  <input
                    type="checkbox"
                    id={mainItem.uid}
                    defaultChecked={isChecked}
                    onChange={checkboxHandler}
                  />
                </div>
              );
            })}
          </ListPrinter>
        </div>
        <div className={classes.buttonGroup}>
          <Button disabled={loading} onClick={createGroup}>
            Create Group
          </Button>
        </div>
      </SideLayout>
    </>
  );
};

export default CreateGroup;
