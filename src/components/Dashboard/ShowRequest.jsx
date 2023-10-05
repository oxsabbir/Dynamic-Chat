import Button from "../UI/Button";
import Glogo from "../../assets/GLogo.png";
import classes from "./ShowRequest.module.css";
import { useContext, useEffect, useState } from "react";
import { stateContext } from "../auth/Context";

import {
  getDatabase,
  onValue,
  ref,
  update,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";

import AddFriend from "../AddFriend";
import { getAuth } from "firebase/auth";
import { icons } from "../UI/Icons";

const ShowRequest = function ({ uid, getFriend }) {
  const { show, toggleFriend } = useContext(stateContext);
  const [pendingList, setPendingList] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    if (!uid) return;
    const db = getDatabase();

    const dbRef = ref(db, "users/" + uid + "/friends");
    onValue(dbRef, (snap) => {
      if (!snap.exists()) {
        getFriend([]);
        setPendingList(null);
        return;
      }
      const data = snap.val();
      const mainData = Object.values(data);

      const pendingFriend = mainData?.filter(
        (item) => item.status === "pending"
      );
      const acceptedFriend = mainData?.filter(
        (item) => item.status === "success"
      );
      console.log(acceptedFriend);

      acceptedFriend.sort((item, items) => {
        return items.lastSent - item.lastSent;
      });

      setPendingList(pendingFriend);
      getFriend(acceptedFriend);
    });
  }, [uid]);

  const cancelHandler = function (event) {
    const db = getDatabase();
    const roomId = event.target.id;

    console.log(roomId);
    const deleteValue = null;
    const updateCreator = {};

    updateCreator["chat-room/" + roomId] = deleteValue;
    updateCreator[`users/${auth.currentUser.uid}/friends/` + roomId] =
      deleteValue;
    return update(ref(db), updateCreator)
      .then(() => console.log("cancel Successs"))
      .catch((err) => console.log(err));
  };

  const acceptHandler = function (event) {
    const reqUid = event.target.id;
    const auth = getAuth();
    const currentUser = {
      uid: auth?.currentUser?.uid,
      names: auth?.currentUser.displayName,
    };

    const { name, roomId, userId } = pendingList?.find(
      (item) => item.userId === reqUid
    );
    AddFriend("accept", reqUid, currentUser, name, roomId);
  };
  console.log(pendingList);
  return (
    <>
      <div className={show ? classes.show : classes.content}>
        {pendingList && pendingList.length === 0 && (
          <>
            <h2 style={{ color: "white", textAlign: "center", padding: "5px" }}>
              There is no request
            </h2>
          </>
        )}

        <ul style={{ listStyle: "none" }}>
          {pendingList &&
            pendingList.map((item) => {
              return (
                <li key={item.userId}>
                  <div className={classes.friendCard}>
                    <img src={Glogo} />
                    <h3>{item.name}</h3>
                    <Button onClick={cancelHandler} id={item.roomId}>
                      {icons.remove}
                    </Button>
                    <Button onClick={acceptHandler} id={item.userId}>
                      {icons.add}
                    </Button>
                  </div>
                </li>
              );
            })}
        </ul>
        <Button onClick={toggleFriend}> Close {icons.remove}</Button>
      </div>
    </>
  );
};

export default ShowRequest;
