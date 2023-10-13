import classes from "./Dashboard.module.css";
import Inbox from "./Inbox";
import Chat from "./Chat";
import { getAuth } from "firebase/auth";
import { redirect } from "react-router-dom";
import { useState } from "react";
import { contextData } from "../auth/Context";

import Header from "../Header";

const Dashboard = function () {
  const { isChatBoxOpen } = contextData();

  const [roomId, setRoomId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  const getRoomId = function (roomId, userId) {
    setRoomId(roomId);
    setUserId(userId);
  };

  return (
    <>
      <div className={classes.contentWrapper}>
        <Header />
        <div className={classes.dashboard}>
          <div className={classes.people}>
            <Inbox getRoom={getRoomId} />
          </div>
          <div className={classes.activeChat}>
            {isChatBoxOpen && <Chat roomId={roomId} userId={userId} />}
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
