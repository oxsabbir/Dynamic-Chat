import { getAuth } from "firebase/auth";
import {
  update,
  push,
  child,
  ref,
  getDatabase,
  serverTimestamp,
} from "firebase/database";

export const unFriend = async function (roomId, friendId) {
  const db = getDatabase();
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;

  console.log(roomId, friendId, authUser);

  const locations = {};
  const nullish = null;

  // delete that friend info from current user profile
  locations[`users/${authUser}/friends/${roomId}`] = nullish;

  // and delete current user info from that friend profile
  locations[`users/${friendId}/friends/${roomId}`] = nullish;

  // delete the room with room id
  locations[`chat-room/${roomId}`] = nullish;

  console.log(locations);

  // that's it
  const updateState = await update(ref(db), locations)
    .then(() => {
      return true;
    })
    .catch((error) => console.log(error));
  return updateState;
};

export const blockFriend = async function (roomId, type, lastMsgKey) {
  // Db setup
  const db = getDatabase();
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;

  let newKey = push(child(ref(db), "friends/")).key;

  let messages = {
    from: authUser,
    names: auth?.currentUser?.displayName,
    blocked: true,
    blockId: newKey,
    time: serverTimestamp(),
  };

  if (type === "unblock") {
    messages = null;
    newKey = lastMsgKey;
  }

  const updates = {};
  updates["chat-room/" + roomId + `/chats/${newKey}`] = messages;

  console.log(updates);

  const updateState = await update(ref(db), updates)
    .then(() => {
      return true;
    })
    .catch((error) => console.log(error));

  return updateState;
};
