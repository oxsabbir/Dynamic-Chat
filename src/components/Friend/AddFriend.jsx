import {
  getDatabase,
  ref,
  push,
  child,
  update,
  serverTimestamp,
} from "firebase/database";

const AddFriend = function (
  requestType,
  requireId,
  currentUser,
  names,
  roomKey,
  userProfile
) {
  // This add the data to other user friends object with an unique id

  const db = getDatabase();

  let newKey = push(child(ref(db), "friends/")).key;

  const anotherKey = push(child(ref(db), "friends/")).key;
  let status = "pending";
  // for accepting request
  if (requestType === "accept") {
    newKey = roomKey;
    status = "success";
  }

  // creating a unique message room

  const requestObject = {
    from: requestType === "accept" ? currentUser.uid : currentUser,
    names: requestType === "accept" ? currentUser.names : names,
    id: anotherKey,
    message: "Hello",
    time: serverTimestamp(),
  };

  const friendData = {
    userId: requestType === "add" ? currentUser : requireId,
    roomId: newKey,
    name: names,
    status: status,
    type: "author",
  };

  if (requestType === "add" && userProfile) {
    friendData.profilePic = userProfile;
  }

  const currentUserData = {
    userId: currentUser.uid,
    roomId: newKey,
    name: currentUser.names,
    status: status,
    type: "requester",
  };

  const updates = {};

  updates["chat-room/" + newKey + `/createdAt`] = serverTimestamp();

  updates["chat-room/" + newKey + `/chats/${anotherKey}`] = requestObject;

  updates["users/" + requireId + "/friends/" + newKey] =
    requestType === "accept" ? currentUserData : friendData;

  if (requestType === "accept") {
    console.log("done sending to current user friend");
    updates["users/" + currentUser.uid + "/friends/" + roomKey] = friendData;
  }

  return update(ref(db), updates);
};

export default AddFriend;
