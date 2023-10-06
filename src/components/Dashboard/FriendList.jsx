import { useEffect, useState } from "react";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import AddFriend from "../AddFriend";
import { getAuth } from "firebase/auth";

const FriendList = function ({ item, isAdded, requested, adds }) {
  const [added, setAdded] = useState(false);

  /// adding friend
  useEffect(() => {
    console.log("changed");
    console.log(requested);
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

  console.log(added, requested);
  return (
    <div className={classes.friendList}>
      <div className={classes.friendCard}>
        <img src={Glogo} />
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
