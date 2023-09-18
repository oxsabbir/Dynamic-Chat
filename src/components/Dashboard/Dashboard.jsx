import classes from "./Dashboard.module.css";
import Inbox from "./Inbox";
import Chat from "./Chat";
const Dashboard = function () {
  return (
    <>
      <div className={classes.dashboard}>
        <div className={classes.people}>
          <Inbox />
        </div>
        <div className={classes.activeChat}>
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
