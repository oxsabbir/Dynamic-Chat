import classes from "./Inbox.module.css";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import FindFriend from "./FindFriend";
import { useState } from "react";

const Inbox = function () {
  const [isSearching, setIsSearching] = useState(false);
  const getBack = () => setIsSearching(false);

  return (
    <>
      {isSearching && <FindFriend getBack={getBack} />}
      {!isSearching && (
        <>
          <div className={classes.inbox}>
            <div className={classes.contact}>
              <h3>Contacts</h3>
              <Button onClick={() => setIsSearching(true)}>Search</Button>
            </div>
            <div className={classes.friendList}>
              <div className={classes.friendCard}>
                <img src={Glogo} />
                <div>
                  <h3>Sabbir Hossain</h3>
                  <div className={classes.message}>
                    hello bro how are
                    yousdfsdfsdfsdfsdgsadferaefrsdfeaefafeasdfsdfsdfasefeee
                  </div>
                </div>
              </div>
              <div className={classes.friendCard}>
                <img src={Glogo} />
                <h3>Sabbir Hossain</h3>
              </div>
              <div className={classes.friendCard}>
                <img src={Glogo} />
                <h3>Sabbir Hossain</h3>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Inbox;
