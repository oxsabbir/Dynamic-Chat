import { useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import classes from "./FindFriend.module.css";
import AddFriend from "./AddFriend";
import { getAuth } from "firebase/auth";
import defaultProfile from "../../assets/defaultProfile.jpg";

const FriendList = function ({ item, authUid, userInfo }) {
  const [isPending, setIsPending] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isRequested, setisRequested] = useState(false);

  let profilePic = item.profilePic;
  if (!item.profilePic) {
    profilePic = defaultProfile;
  }

  /// adding friend
  useEffect(() => {
    if (item.friends) {
      // checking is there any request yet
      const listOfFriend = Object.values(item.friends);
      // checking if friend already added
      listOfFriend.find((item) => {
        if (item.userId === authUid && item.status === "pending") {
          setIsPending(true);
        }
        if (item.userId === authUid && item.status === "success") {
          setIsAdded(true);
        }
      });
    }

    // looking if user already requested
    if (!userInfo.friends) return;
    const userFriends = Object.values(userInfo.friends);
    const currenItem = userFriends.find((current) => {
      if (item.uid === current.userId && current.status === "pending") {
        setisRequested(true);
      }
    });
  }, [item]);

  const addRequestHandler = function (event) {
    const requireId = event.target.id;
    const auth = getAuth();
    const currentUser = auth?.currentUser?.uid;
    AddFriend(
      "add",
      requireId,
      currentUser,
      userInfo.userName,
      "",
      userInfo.profilePic
    );
    setIsPending(true);
  };

  // returning when our account comes
  if (item.uid === authUid) return;

  return (
    <div className={classes.friendList}>
      <div className={classes.friendCard}>
        <img src={profilePic} />
        <h3>{item.userName}</h3>
        {isPending && !isAdded && <p>Pending</p>}
        {isAdded && <p>Added</p>}
        {isRequested && <p>Check request</p>}
        {!isPending && !isAdded && !isRequested && (
          <Button onClick={addRequestHandler} id={item.uid}>
            Say Hello
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendList;
