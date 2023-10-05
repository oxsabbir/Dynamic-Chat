import { useEffect, useRef, useState } from "react";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import { getDatabase } from "firebase/database";
import { ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import AddFriend from "../AddFriend";
import { icons } from "../UI/Icons";
import FriendList from "./FriendList";

const FindFriend = function ({ getBack }) {
  const db = getDatabase();
  const searchRef = useRef();
  const auth = getAuth();
  const allUsers = ref(db, "/users");
  const [userData, setUserData] = useState(null);
  const [authUserFriend, setAuthUserFriend] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [isRequested, setIsRequested] = useState([]);

  let timer;

  useEffect(() => {
    const authUid = auth?.currentUser?.uid;
    onValue(allUsers, (snaps) => {
      const data = snaps.val();

      if (data[authUid].friends) {
        if (Object.values(data[authUid].friends)) {
          const currentUserFriend = Object.values(data[authUid].friends);
          const newuser = currentUserFriend.map((item) => item.userId);
          setAuthUserFriend(newuser);
        }
      }

      const values = Object.values(data);

      setUserData(values);
    });
  }, []);

  const searchHandler = function (e) {
    const inputValue = e.target.value;
    console.log(inputValue);
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
      // checking if friend already exist
      mainData.map((item) => {
        if (!item.friends) {
          setIsRequested([]);
          return;
        }
        const theirFrinds = Object.values(item.friends);
        const listOfPending = theirFrinds.map((item) => {
          if (item.status === "pending") {
            return item.userId;
          }
        });

        console.log(listOfPending, mainData);
        setIsRequested(listOfPending);
      });

      setSearchedUser(mainData);
    }, 1300);
  };

  return (
    <>
      <div className={classes.findSection}>
        <div className={classes.searchBar}>
          <Button onClick={getBack}>{icons.back}</Button>
          <input
            onKeyUp={searchHandler}
            ref={searchRef}
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
              const requested = isRequested.includes(auth.currentUser.uid);
              console.log(isRequested, requested);

              if (auth.currentUser.uid === item.uid) {
                setSearchedUser([]);
              }

              return (
                <li key={item.uid}>
                  <FriendList
                    isAdded={isAdded}
                    requested={requested}
                    item={item}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default FindFriend;
