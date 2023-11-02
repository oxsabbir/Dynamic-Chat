import classes from "./Inbox.module.css";
import Button from "../UI/Button/Button";
import FindFriend from "../Friend/FindFriend";
import { useState } from "react";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { useLoaderData } from "react-router-dom";
import ShowRequest from "../Friend/ShowRequest";
import { icons } from "../UI/Icons";
import MobileUi from "../UI/MobileMenu/MobileUi";
import Loading from "../UI/Loading/Loading";
import LastMessage from "./LastMessage";
import Setting from "../Setting/Setting";
import { contextData } from "../auth/Context";
import People from "../Users/People";

const Inbox = function () {
  const currentUser = useLoaderData();
  const { isInboxOpen, acceptedFriend, togglePeople } = contextData();
  const [isSearching, setIsSearching] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});

  const getCurrentUser = function (children) {
    setCurrentUserData(children);
  };
  const getBack = () => setIsSearching(false);
  // Profile pic validation
  let profilePhoto = currentUserData.profilePic;
  if (!currentUserData.profilePic) {
    profilePhoto = defaultProfile;
  }
  return (
    <>
      {isSearching && (
        <FindFriend userInfo={currentUserData} getBack={getBack} />
      )}
      {!isSearching && (
        <>
          <Setting userInfo={currentUserData} />
          <People
            authUid={currentUser?.uid}
            userInfo={currentUserData}
            acceptedFriend={acceptedFriend}
          />
          <ShowRequest getCurrentUser={getCurrentUser} uid={currentUser?.uid} />

          <div
            className={`${classes.inbox} ${
              isInboxOpen ? classes.hidebody : ""
            }`}
          >
            <MobileUi />
            <div className={classes.contact}>
              <img src={profilePhoto} />
              <h2>{currentUserData.userName}</h2>
              <Button onClick={() => setIsSearching(true)}>
                {icons.search}
              </Button>
            </div>

            <ul style={{ listStyle: "none", overflow: "auto" }}>
              {!acceptedFriend && <Loading />}
              {acceptedFriend && !acceptedFriend.length > 0 && (
                <div className={classes.emptyInbox}>
                  <h3>You don't have any friends right now.</h3>
                  <Button onClick={() => togglePeople()}>
                    Let's make some
                  </Button>
                </div>
              )}

              {acceptedFriend &&
                acceptedFriend.map((item) => (
                  <li key={item.roomId}>
                    <LastMessage item={item} uid={currentUser.uid} />
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
