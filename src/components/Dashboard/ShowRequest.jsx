import Button from "../UI/Button";
import Glogo from "../../assets/GLogo.png";
import classes from "./ShowRequest.module.css";
import { useContext, useEffect, useState } from "react";
import { stateContext } from "../auth/Context";

import { getDatabase, onValue, ref } from "firebase/database";

const ShowRequest = function ({ uid }) {
  const { show } = useContext(stateContext);
  const [friendList, setFriendList] = useState(null);

  useEffect(() => {
    if (!uid) return;
    const db = getDatabase();

    const dbRef = ref(db, "users/" + uid + "/friends");
    onValue(dbRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.val();
      const mainData = Object.values(data);
      setFriendList(mainData);
    });
  }, [uid]);

  const acceptHandler = function (event) {
    const reqUid = event.target.id;
    console.log(reqUid);
    const db = getDatabase();
    // go to the chat room and send a message to the with the room id

    // go to the requester database and add a friend section put this as an accepted friend

    // go into auth user friend section and change the status to success

    // then add all the success status profile to the inbox and when user click on one of them then using there chatRoom id we can open message section
  };

  console.log(friendList);
  return (
    <>
      <div className={show ? classes.show : classes.content}>
        {!friendList && (
          <h2 style={{ color: "white", textAlign: "center", padding: "5px" }}>
            There is no request
          </h2>
        )}
        <ul style={{ listStyle: "none" }}>
          {friendList &&
            friendList.map((item) => {
              if (!item.status === "pending") return;
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
