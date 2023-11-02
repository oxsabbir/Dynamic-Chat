import classes from "./Dashboard.module.css";

import Chat from "../Chat/Chat.jsx";
import { getAuth } from "firebase/auth";
import { redirect } from "react-router-dom";
import { contextData } from "../auth/Context";
import Header from "./Header.jsx";
import BlankBody from "../Layout/BlankBody.jsx";
import Inbox from "../Inbox/Inbox.jsx";

const Dashboard = function () {
  const { isChatBoxOpen, isDarkTheme } = contextData();
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
              <Inbox />
            </div>
            <div className={classes.activeChat}>
              {isChatBoxOpen && <Chat />}
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
