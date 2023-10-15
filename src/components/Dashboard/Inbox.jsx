import classes from "./Inbox.module.css";
import Button from "../UI/Button";
import FindFriend from "./FindFriend";
import { useState } from "react";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { useLoaderData } from "react-router-dom";
import ShowRequest from "./ShowRequest";
import { icons } from "../UI/Icons";
import MobileUi from "./MobileUi";
import Loading from "../UI/Loading";
import LastMessage from "./LastMessage";
import Setting from "../Setting";
import { contextData } from "../auth/Context";
import People from "./People";

const Inbox = function ({ getRoom }) {
  const currentUser = useLoaderData();
  const { toggleInbox, isInboxOpen, toggleActiveChat, toggleChatBox } =
    contextData();
  const [isSearching, setIsSearching] = useState(false);
  const [acceptedFriend, setAcceptedFriend] = useState(null);
  const [currentUserData, setCurrentUserData] = useState({});

  const frinedSetter = function (children) {
    setAcceptedFriend(children);
  };

  const getCurrentUser = function (children) {
    setCurrentUserData(children);
  };

  const getBack = () => setIsSearching(false);

  // Profile pic validation
  let profilePhoto = currentUserData.profilePic;
  if (!currentUserData.profilePic) {
    profilePhoto = defaultProfile;
  }

  const openChatHandler = function (event) {
    const roomId = event.target.id;
    const userId = event.target.dataset.test;
    const targetUser = acceptedFriend.find((item) => item.roomId === roomId);
    getRoom(roomId, userId);
    toggleInbox();
    toggleActiveChat(userId);
    toggleChatBox(true);
  };

  return (
    <>
      {isSearching && (
        <FindFriend userInfo={currentUserData} getBack={getBack} />
      )}
      {!isSearching && (
        <>
          <Setting userInfo={currentUserData} />
          <People authUid={currentUser?.uid} userInfo={currentUserData} />
          <ShowRequest
            getFriend={frinedSetter}
            getCurrentUser={getCurrentUser}
            uid={currentUser?.uid}
          />

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
                  <Button onClick={() => setIsSearching(true)}>
                    FindFriend
                  </Button>
                </div>
              )}

              {acceptedFriend &&
                acceptedFriend.map((item) => (
                  <li key={item.userId}>
                    <LastMessage
                      item={item}
                      chatHandler={openChatHandler}
                      uid={currentUser.uid}
                    />
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
