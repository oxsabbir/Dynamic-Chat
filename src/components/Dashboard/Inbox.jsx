import classes from "./Inbox.module.css";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import FindFriend from "./FindFriend";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
const Inbox = function () {
  const currentUser = useLoaderData();
  const [friend, setFriend] = useState(null);

  let profilePhoto = currentUser?.photoURL;
  let userName = currentUser?.displayName;
  !userName ? (userName = "NO NAME") : null;
  if (!profilePhoto) {
    profilePhoto = defaultProfile;
  }

  const [isSearching, setIsSearching] = useState(false);
  const getBack = () => setIsSearching(false);

  return (
    <>
      {isSearching && <FindFriend getBack={getBack} />}
      {!isSearching && (
        <>
          <div className={classes.inbox}>
            <div className={classes.contact}>
              <img src={profilePhoto} />
              <h2>{userName}</h2>
              <Button onClick={() => setIsSearching(true)}>Search</Button>
            </div>

            <div className={classes.friendList}>
              <div className={classes.friendCard}>
                <img src={Glogo} />
                <div>
                  <h3>Sabbir Hossain</h3>
                  <div className={classes.message}>
                    hello bro how are
                    yousdfsdfsdfsdfsdgsadferaefrsdfeaefafeasdfsdfsdfasefeee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Inbox;
