import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import { getDatabase } from "firebase/database";
import { ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { icons } from "../UI/Icons";
import FriendList from "./FriendList";
import FallbackMessage from "../UI/FallbackMessage";
import ListPrinter from "../UI/ListPrinter";

const FindFriend = function ({ getBack }) {
  const db = getDatabase();
  const searchRef = useRef();
  const auth = getAuth();
  const authUid = auth?.currentUser?.uid;

  const allUsers = ref(db, "/users");
  const [userData, setUserData] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    onValue(allUsers, (snaps) => {
      const data = snaps.val();
      const values = Object.values(data);
      setUserData(values);
    });
  }, [isSearching]);

  // SearchHandler
  let timer;

  const searchHandler = function (e) {
    setIsSearching((prev) => !prev);

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
          <FallbackMessage>No user found</FallbackMessage>
        )}
        <ListPrinter>
          {searchedUser &&
            searchedUser.map((item) => {
              return (
                <li key={item.uid}>
                  <FriendList item={item} authUid={authUid} />
                </li>
              );
            })}
        </ListPrinter>
      </div>
    </>
  );
};

export default FindFriend;
