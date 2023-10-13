import Button from "../UI/Button";
import Glogo from "../../assets/GLogo.png";
import classes from "./ShowRequest.module.css";
import { useContext, useEffect, useState } from "react";
import { stateContext } from "../auth/Context";
import { getDatabase, onValue, ref, update } from "firebase/database";
import AddFriend from "../AddFriend";
import { getAuth } from "firebase/auth";
import { icons } from "../UI/Icons";
import FallbackMessage from "../UI/FallbackMessage";

const ShowRequest = function ({ uid, getFriend, getCurrentUser }) {
  const { show, toggleFriend } = useContext(stateContext);
  const [pendingList, setPendingList] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    if (!uid) return;
    const db = getDatabase();
    const dbRef = ref(db, "users/" + uid + "/friends");

    onValue(dbRef, (snap) => {
      if (!snap.exists()) {
        getFriend([]);
        setPendingList([]);
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

      acceptedFriend.sort((item, items) => {
        return items.lastSent - item.lastSent;
      });

      const authUserRef = ref(db, `users/${uid}`);
      onValue(authUserRef, (snap) => {
        if (snap.exists()) {
          const data = snap.val();
          getCurrentUser(data);
        }
      });

      setPendingList(pendingFriend);
      getFriend(acceptedFriend);
    });
  }, [uid]);

  const cancelHandler = function (event) {
    const db = getDatabase();
    const roomId = event.target.id;

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

    const userPending = pendingList?.find((item) => item.userId === reqUid);
    AddFriend(
      "accept",
      reqUid,
      currentUser,
      userPending.name,
      userPending.roomId
    );
  };
  return (
    <>
      <div className={show ? classes.show : classes.content}>
        <div className={classes.requestBar}>
          <h2>Friend Request</h2>
          <Button onClick={toggleFriend}>{icons.back}</Button>
        </div>

        {pendingList && pendingList.length === 0 && (
          <>
            <FallbackMessage>There is no request</FallbackMessage>
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
      </div>
    </>
  );
};

export default ShowRequest;
