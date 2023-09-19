import classes from "./Dashboard.module.css";
import Inbox from "./Inbox";
import Chat from "./Chat";
import { getAuth } from "firebase/auth";
import { redirect } from "react-router-dom";
const Dashboard = function () {
  return (
    <>
      <div className={classes.dashboard}>
        <div className={classes.people}>
          <Inbox />
        </div>
        <div className={classes.activeChat}>
          {
            // chat components need an roomId to show all the incoming and outgoing message
          }
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

export const loader = function () {
  if (!localStorage.getItem("isLoggedIn")) {
    return redirect("/");
  }
  const auth = getAuth();
  return auth.currentUser;
};
