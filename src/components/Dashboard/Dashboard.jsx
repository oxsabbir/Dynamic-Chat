import classes from "./Dashboard.module.css";
import Inbox from "./Inbox";
import Chat from "./Chat";
import { getAuth } from "firebase/auth";
import { redirect } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
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

export const loader = async function () {
  if (!localStorage.getItem("isLoggedIn")) {
    return redirect("/");
  }
  const auth = getAuth();

  // getting the accepted friend
  const currentUid = auth?.currentUser?.uid;
  console.log(currentUid);

  const db = getDatabase();
  const dbRef = ref(db, "users/" + currentUid + "/friends");
  onValue(dbRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.val();
    const mainData = Object.values(data);
  });

  return auth.currentUser;
};
