import classes from "./Inbox.module.css";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import FindFriend from "./FindFriend";
import { useState } from "react";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { useLoaderData } from "react-router-dom";
import ShowRequest from "./ShowRequest";
import FallbackMessage from "../UI/FallbackMessage";
import { icons } from "../UI/Icons";
import MobileUi from "./MobileUi";
import { useContext } from "react";
import { stateContext } from "../auth/Context";
import Loading from "../UI/Loading";
import LastMessage from "./LastMessage";

const Inbox = function ({ getRoom }) {
  const currentUser = useLoaderData();
  const { toggleInbox, isInboxOpen, toggleActiveChat } =
    useContext(stateContext);

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
    const userId = event.target.dataset.test;
    const targetUser = acceptedFriend.find((item) => item.roomId === roomId);

    console.log(targetUser);

    getRoom(roomId, userId);

    toggleInbox();
    toggleActiveChat(userId);
  };

  return (
    <>
      {isSearching && <FindFriend getBack={getBack} />}
      {!isSearching && (
        <>
          <ShowRequest getFriend={frinedSetter} uid={currentUser?.uid} />

          <div
            className={`${classes.inbox} ${
              isInboxOpen ? classes.hidebody : ""
            }`}
          >
            <MobileUi />

            <div className={classes.contact}>
              <img src={profilePhoto} />
              <h2>{userName}</h2>
              <Button onClick={() => setIsSearching(true)}>
                {icons.search}
              </Button>
            </div>

            <ul style={{ listStyle: "none", overflow: "auto" }}>
              {!acceptedFriend && <Loading />}
              {acceptedFriend && !acceptedFriend.length > 0 && (
                <FallbackMessage>Inbox is empty</FallbackMessage>
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
