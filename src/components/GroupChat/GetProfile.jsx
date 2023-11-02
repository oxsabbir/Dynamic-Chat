import { useEffect, useState } from "react";
import classes from "./GroupMenu.module.css";
import {
  getDatabase,
  ref,
  onValue,
  push,
  child,
  update,
} from "firebase/database";
import Button from "../UI/Button/Button";
import { contextData } from "../auth/Context";

const GetProfile = function ({ userId, roomId, groupInfo }) {
  const [item, setItem] = useState({});
  const { currentUserData } = contextData();

  const addMemberHandler = async function (event) {
    const db = getDatabase();
    const id = event.target.id;

    let newKey = push(child(ref(db), "friends/")).key;

    const addingStatus = {
      type: "status",
      title: `${currentUserData.userName} added ${item.userName} to the group`,
    };

    const addUserObject = {
      userName: item.userName,
      uid: item.uid,
      profilePic: item.profilePic,
      id: newKey,
    };
    // userID for writig in userFriend
    const addUpdate = {};
    addUpdate[`users/${id}/friends/${roomId}`] = groupInfo;
    addUpdate[`chat-room/${roomId}/roomMember/${newKey}`] = addUserObject;
    addUpdate[`chat-room/${roomId}/chats/${newKey}`] = addingStatus;
    console.log(addingStatus);
    return update(ref(db), addUpdate).then(() => console.log("user add"));
    // roomID for adding as member
  };

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const unsub = onValue(userRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      setItem(data);
    });

    return unsub();
  }, [userId]);

  return (
    <>
      <div key={item.uid} className={classes.friendList}>
        <div className={classes.friendCard}>
          <img src={item?.profilePic} />
          <h3>{item.userName}</h3>
          <Button id={item.uid} onClick={addMemberHandler}>
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

export default GetProfile;
