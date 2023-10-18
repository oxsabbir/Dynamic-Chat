import classes from "./Dashboard.module.css";
import Inbox from "./Inbox";
import Chat from "./Chat";
import { getAuth } from "firebase/auth";
import { redirect } from "react-router-dom";
import { useState } from "react";
import { contextData } from "../auth/Context";
import Header from "../Header";
import BlankBody from "./BlankBody";

const Dashboard = function () {
  const { isChatBoxOpen, isDarkTheme } = contextData();
  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);
  const getRoomId = function (roomId, userId) {
    setRoomId(roomId);
    setUserId(userId);
  };
  return (
    <>
      <div
        className={`${
          isDarkTheme ? classes.containerDark : classes.containerLight
        }`}
      >
        <div className={classes.contentWrapper}>
          <Header />
          <div className={classes.dashboard}>
            <div className={classes.people}>
              <Inbox getRoom={getRoomId} />
            </div>
            <div className={classes.activeChat}>
              {isChatBoxOpen && <Chat roomId={roomId} userId={userId} />}
              {!isChatBoxOpen && <BlankBody />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

export const loader = async function () {
  if (!localStorage.getItem("isLoggedIn")) {
    return redirect("/");
  }
  const auth = getAuth();

  return auth.currentUser;
};
