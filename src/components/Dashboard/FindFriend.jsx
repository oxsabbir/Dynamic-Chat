import { useEffect, useState } from "react";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import { getDatabase, set } from "firebase/database";
import { ref, onValue, child, push, update } from "firebase/database";
import { getAuth } from "firebase/auth";

const FindFriend = function ({ getBack }) {
  const db = getDatabase();
  const allUsers = ref(db, "/users");
  const [userData, setUserData] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);
  let timer;

  useEffect(() => {
    onValue(allUsers, (snaps) => {
      const data = snaps.val();
      const values = Object.values(data);
      setUserData(values);
    });
  }, []);

  const searchHandler = function (e) {
    const inputValue = e.target.value;

    if (inputValue.trim().length === 0) {
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      const mainData = userData?.filter((item) => {
        const names = item.userName.toLowerCase();
        const input = inputValue.toLowerCase();
        return names.startsWith(input);
      });
      console.log(mainData);
      setSearchedUser(mainData);
    }, 1300);
  };

  const addRequestHandler = function (event) {
    const requireId = event.target.id;
    const db = getDatabase();
    const auth = getAuth();
    const currentUser = auth.currentUser.uid;
    const names = auth.currentUser.displayName;

    // This add the data to other user friends object with an unique id

    const newKey = push(child(ref(db), "friends/")).key;

    console.log(newKey);
    // creating a unique message room
    set(ref(db, "chat-room/" + newKey), {
      from: currentUser,
      names: names,
      message: "Hello",
    })
      .then(() => console.log("room created"))
      .catch((err) => console.log(err));

    const friendData = {
      userId: currentUser,
      roomId: newKey,
      name: names,
      status: "pending",
    };

    const updates = {};
    updates["users/" + requireId + "/friends/" + newKey] = friendData;
    return update(ref(db), updates).then(() => console.log("sendit"));
  };

  return (
    <>
      <div className={classes.findSection}>
        <div className={classes.searchBar}>
          <Button onClick={getBack}>Back</Button>
          <input
            onKeyUp={searchHandler}
            type="search"
            name="search"
            placeholder="Search your friend"
          />
        </div>
        {searchedUser.length === 0 && (
          <h2 style={{ padding: "20px", textAlign: "center", color: "white" }}>
            No user found
          </h2>
        )}

        <ul style={{ listStyle: "none" }}>
          {searchedUser &&
            searchedUser.map((item) => (
              <li key={item.uid}>
                <div className={classes.friendList}>
                  <div className={classes.friendCard}>
                    <img src={Glogo} />
                    <h3>{item.userName}</h3>
                    <Button onClick={addRequestHandler} id={item.uid}>
                      Say Hello
                    </Button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default FindFriend;
