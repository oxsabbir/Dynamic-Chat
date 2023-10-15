import classes from "./People.module.css";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import ListPrinter from "../UI/ListPrinter";
import FriendList from "./FriendList";
import { contextData } from "../auth/Context";
import Button from "../UI/Button";
import { icons } from "../UI/Icons";

import Loading from "../UI/Loading";

const People = function ({ authUid, userInfo }) {
  const { isPeopleOpen, togglePeople } = contextData();
  const db = getDatabase();
  const allUsers = ref(db, "/users");
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (!isPeopleOpen) return;
    onValue(allUsers, (snaps) => {
      const data = snaps.val();
      const values = Object.values(data);
      setUserData(values);
    });
  }, [isPeopleOpen]);
  return (
    <div
      className={`${classes.recommendedFriend} ${
        isPeopleOpen ? classes.show : classes.hide
      }`}
    >
      <div className={classes.recommendBar}>
        <h3>Explore People</h3>
        <Button onClick={() => togglePeople()}>{icons.back}</Button>
      </div>
      {userData.length === 0 && <Loading />}
      <ListPrinter>
        {userData.length > 0 &&
          userData?.map((item) => (
            <li key={item.uid}>
              <FriendList item={item} authUid={authUid} userInfo={userInfo} />
            </li>
          ))}
      </ListPrinter>
    </div>
  );
};

export default People;
