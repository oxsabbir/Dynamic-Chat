import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, child, update, set } from "firebase/database";

const AddFriend = function (
  requestType,
  requireId,
  currentUser,
  names,
  roomKey
) {
  // This add the data to other user friends object with an unique id
  const db = getDatabase();

  let newKey = push(child(ref(db), "friends/")).key;
  console.log(roomKey);

  const anotherKey = push(child(ref(db), "friends/")).key;
  let status = "pending";
  // for accepting request
  if (requestType === "accept") {
    newKey = roomKey;
    status = "success";
  }

  console.log(requireId);

  console.log(anotherKey);
  // creating a unique message room
  set(ref(db, "chat-room/" + newKey + `/${anotherKey}`), {
    from: requestType === "accept" ? currentUser.uid : currentUser,
    names: requestType === "accept" ? currentUser.names : names,
    message: "Hello",
  })
    .then(() => console.log("room created"))
    .catch((err) => console.log(err));

  // we need to use the update method for pushing all the messages

  const friendData = {
    userId: requestType === "add" ? currentUser : requireId,
    roomId: newKey,
    name: names,
    status: status,
    type: "author",
  };

  const currentUserData = {
    userId: currentUser.uid,
    roomId: newKey,
    name: currentUser.names,
    status: status,
    type: "requester",
  };

  const updates = {};

  updates["users/" + requireId + "/friends/" + newKey] =
    requestType === "accept" ? currentUserData : friendData;
  console.log(updates);

  if (requestType === "accept") {
    console.log("done sending to current user friend");
    updates["users/" + currentUser.uid + "/friends/" + roomKey] = friendData;
  }

  return update(ref(db), updates);
};

export default AddFriend;
