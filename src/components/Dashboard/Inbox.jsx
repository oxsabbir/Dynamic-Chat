import classes from "./Inbox.module.css";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import FindFriend from "./FindFriend";
import { useState } from "react";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { useLoaderData } from "react-router-dom";
import ShowRequest from "./ShowRequest";
import FallbackMessage from "../UI/FallbackMessage";

const Inbox = function ({ getRoom }) {
  const currentUser = useLoaderData();

  const [isSearching, setIsSearching] = useState(false);
  const [acceptedFriend, setAcceptedFriend] = useState(null);

  const frinedSetter = function (children) {
    setAcceptedFriend(children);
  };
  const getBack = () => setIsSearching(false);

  // Profile pic validation
  let profilePhoto = currentUser?.photoURL;
  let userName = currentUser?.displayName;
  !userName ? (userName = "NO NAME") : null;
  if (!profilePhoto) {
    profilePhoto = defaultProfile;
  }

  const openChatHandler = function (event) {
    const roomId = event.target.id;
    console.log(roomId);
    getRoom(roomId);
  };

  return (
    <>
      {isSearching && <FindFriend getBack={getBack} />}
      {!isSearching && (
        <>
          <ShowRequest getFriend={frinedSetter} uid={currentUser?.uid} />
          <div className={classes.inbox}>
            <div className={classes.contact}>
              <img src={profilePhoto} />
              <h2>{userName}</h2>
              <Button onClick={() => setIsSearching(true)}>Search</Button>
            </div>

            <ul style={{ listStyle: "none" }}>
              {acceptedFriend && !acceptedFriend.length > 0 && (
                <FallbackMessage>Inbox is empty</FallbackMessage>
              )}
              {acceptedFriend &&
                acceptedFriend.map((item) => (
                  <li key={item.userId}>
                    <div className={classes.friendList}>
                      <div
                        id={item.roomId}
                        onClick={openChatHandler}
                        className={classes.friendCard}
                      >
                        <img src={Glogo} />
                        <div>
                          <h3>{item.name}</h3>
                          <p className={classes.message}>
                            Last Message for the moomment
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Inbox;
