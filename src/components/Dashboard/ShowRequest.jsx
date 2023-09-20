import Button from "../UI/Button";
import Glogo from "../../assets/GLogo.png";
import classes from "./ShowRequest.module.css";
import { useContext, useEffect, useState } from "react";
import { stateContext } from "../auth/Context";

import { getDatabase, onValue, ref } from "firebase/database";
import AddFriend from "../AddFriend";
import { getAuth } from "firebase/auth";

const ShowRequest = function ({ uid, getFriend }) {
  const { show } = useContext(stateContext);
  const [pendingList, setPendingList] = useState(null);

  useEffect(() => {
    if (!uid) return;
    const db = getDatabase();

    const dbRef = ref(db, "users/" + uid + "/friends");
    onValue(dbRef, (snap) => {
      if (!snap.exists()) {
        console.log("there is nothing");
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
      setPendingList(pendingFriend);
      getFriend(acceptedFriend);
    });
  }, [uid]);

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

    // go to the chat room and send a message to the with the room id

    AddFriend("accept", reqUid, currentUser, name, roomId);
    // go to the requester database and add a friend section put this as an accepted friend

    // go into auth user friend section and change the status to success

    // then add all the success status profile to the inbox and when user click on one of them then using there chatRoom id we can open message section
  };

  return (
    <>
      <div className={show ? classes.show : classes.content}>
        {!pendingList && (
          <h2 style={{ color: "white", textAlign: "center", padding: "5px" }}>
            There is no request
          </h2>
        )}
        <ul style={{ listStyle: "none" }}>
          {pendingList &&
            pendingList.map((item) => {
              return (
                <li key={item.userId}>
                  <div className={classes.friendCard}>
                    <img src={Glogo} />
                    <h3>{item.name}</h3>
                    <Button onClick={acceptHandler} id={item.userId}>
                      Say hello
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
