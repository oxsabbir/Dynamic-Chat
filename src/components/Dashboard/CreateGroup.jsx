import SideLayout from "../Layout/SideLayout";
import classes from "./CreateGroup.module.css";
import ListPrinter from "../UI/ListPrinter";
import Button from "../UI/Button";
import { useRef, useState } from "react";
import useSearching from "./useSearching";
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
import uploadMedia from "../UploadMedia";

const CreateGroup = function ({ getBack, isShown, acceptedFriend, allUser }) {
  const auth = getAuth();
  const fileRef = useRef();
  const currentUserInfo = allUser.find(
    (item) => item.uid === auth.currentUser.uid
  );
  const [selectedUser, setSelectedUser] = useState([currentUserInfo]);
  const [userList, setUserList] = useState(acceptedFriend);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");

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
      const data = useSearching(acceptedFriend, "name", value);
      setUserList(data);
    } else {
      setUserList(acceptedFriend);
    }
  };
  const imageSelectorHandler = function () {
    const imageUrl = URL.createObjectURL(fileRef.current.files[0], {
      matchMedia: "image",
    });
    setIsImageSelected(true);
    setGroupImage(imageUrl);
  };

  const createGroupHandler = async function (imageUrl) {
    const db = getDatabase();
    let newKey = push(child(ref(db), "friends/")).key;
    let groupDetails = {
      userName: groupName,
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

    const updateDir = {};
    updateDir[`users/${auth.currentUser?.uid}/friends/${newKey}`] =
      groupDetails;
    updateDir[`chat-room/${newKey}/chats/${newKey}`] = firstMessage;
    updateDir[`chat-room/${newKey}/createdAt`] = serverTimestamp();
    updateDir[`chat-room/${newKey}/roomMember`] = selectedUser;
    selectedUser.forEach(
      (item) =>
        (updateDir[`users/${item.uid}/friends/${newKey}`] = groupDetails)
    );
    return update(ref(db), updateDir);
  };

  const createGroup = async function () {
    const storage = getStorage();
    const db = getDatabase();
    const newKey = push(child(ref(db), "friends/")).key;
    const groupImageRef = imageRef(storage, `image/groupProifle/${newKey}`);

    uploadMedia(
      fileRef.current.files[0],
      groupImageRef,
      createGroupHandler
    ).then(() => console.log("success"));
  };

  console.log(selectedUser);

  return (
    <>
      <SideLayout
        title={"Create Group"}
        backHandler={getBack}
        isShown={isShown}
      >
        <div className={classes.groupDetails}>
          {!isImageSelected && (
            <span onClick={() => fileRef.current.click()}>{icons.upload}</span>
          )}
          {isImageSelected && <img src={groupImage} alt="group-image" />}
          <input type="file" ref={fileRef} onChange={imageSelectorHandler} />
          <input
            type="text"
            placeholder="Group Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className={classes.searchBar}>
          <input
            type="search"
            placeholder="Type user Name"
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
          <Button onClick={createGroup}>Create Group</Button>
        </div>
      </SideLayout>
    </>
  );
};

export default CreateGroup;
