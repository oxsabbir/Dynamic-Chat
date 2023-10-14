import { useEffect, useState } from "react";
import Glogo from "../../assets/Glogo.png";
import Button from "../UI/Button";
import classes from "./FindFriend.module.css";
import AddFriend from "../AddFriend";
import { getAuth } from "firebase/auth";
import defaultProfile from "../../assets/defaultProfile.jpg";

const FriendList = function ({ item, authUid }) {
  //
  const [isPending, setIsPending] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  let profilePic = item.profilePic;
  if (!item.profilePic) {
    profilePic = defaultProfile;
  }
  /// adding friend
  useEffect(() => {
    if (!item.friends) {
      // checking is there any request yet
      setIsAdded(false);
      setIsPending(false);
      return;
    }
    const listOfFriend = Object.values(item.friends);
    // checking if friend already added
    listOfFriend.find((item) => {
      if (item.userId === authUid && item.status === "pending") {
        console.log("pending");
        setIsPending(true);
      }
      if (item.userId === authUid && item.status === "success") {
        console.log("added");
        setIsAdded(true);
      }
    });
  }, [item]);

  const addRequestHandler = function (event) {
    const requireId = event.target.id;
    const auth = getAuth();
    const currentUser = auth?.currentUser?.uid;
    const names = auth.currentUser?.displayName;

    AddFriend("add", requireId, currentUser, names);
    setIsPending(true);
  };

  // returning when out account comes
  if (item.uid === authUid) return;

  return (
    <div className={classes.friendList}>
      <div className={classes.friendCard}>
        <img src={profilePic} />
        <h3>{item.userName}</h3>
        {isPending && !isAdded && <p>Pending</p>}
        {isAdded && <p>Added</p>}

        {!isPending && !isAdded && (
          <Button onClick={addRequestHandler} id={item.uid}>
            Say Hello
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendList;
