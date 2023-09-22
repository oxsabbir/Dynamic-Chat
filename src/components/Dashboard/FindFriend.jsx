import { useEffect, useState } from "react";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import { getDatabase } from "firebase/database";
import { ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import AddFriend from "../AddFriend";

const FindFriend = function ({ getBack }) {
  const db = getDatabase();
  const auth = getAuth();
  const allUsers = ref(db, "/users");
  const [userData, setUserData] = useState(null);
  const [authUserFriend, setAuthUserFriend] = useState(null);

  const [searchedUser, setSearchedUser] = useState([]);
  let timer;

  useEffect(() => {
    const authUid = auth?.currentUser?.uid;
    onValue(allUsers, (snaps) => {
      const data = snaps.val();
      const currentUserFriend = Object.values(data[authUid].friends);
      const newuser = currentUserFriend.map((item) => item.userId);
      setAuthUserFriend(newuser);
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

  /// adding friend
  const addRequestHandler = function (event) {
    const requireId = event.target.id;
    const db = getDatabase();
    const auth = getAuth();
    const currentUser = auth?.currentUser?.uid;
    const names = auth.currentUser?.displayName;

    AddFriend("add", requireId, currentUser, names);
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
            searchedUser.map((item) => {
              const isAdded = authUserFriend.includes(item.uid);
              if (auth.currentUser.uid === item.uid) {
                setSearchedUser([]);
              }

              return (
                <li key={item.uid}>
                  <div className={classes.friendList}>
                    <div className={classes.friendCard}>
                      <img src={Glogo} />
                      <h3>{item.userName}</h3>
                      {isAdded && <p>Added</p>}
                      {!isAdded && (
                        <Button onClick={addRequestHandler} id={item.uid}>
                          Say Hello
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default FindFriend;
