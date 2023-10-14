import { useEffect, useState } from "react";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import AddFriend from "../AddFriend";
import { getAuth } from "firebase/auth";
import defaultProfile from "../../assets/defaultProfile.jpg";

const FriendList = function ({ item, isAdded, requested, adds }) {
  const [added, setAdded] = useState(false);
  let profilePic = item.profilePic;
  if (!item.profilePic) {
    profilePic = defaultProfile;
  }
  /// adding friend
  useEffect(() => {
    setAdded(false);
  }, [item]);

  const addRequestHandler = function (event) {
    const requireId = event.target.id;
    const auth = getAuth();
    const currentUser = auth?.currentUser?.uid;
    const names = auth.currentUser?.displayName;

    AddFriend("add", requireId, currentUser, names);
    setAdded(true);
  };

  return (
    <div className={classes.friendList}>
      <div className={classes.friendCard}>
        <img src={profilePic} />
        <h3>{item.userName}</h3>
        {isAdded && <p>Added</p>}

        {(requested || added) && <p>Pending</p>}

        {!isAdded && !requested && !added && (
          <Button onClick={addRequestHandler} id={item.uid}>
            Say Hello
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendList;
