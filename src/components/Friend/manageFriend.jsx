import { getAuth } from "firebase/auth";
import {
  update,
  push,
  child,
  ref,
  getDatabase,
  serverTimestamp,
} from "firebase/database";

export const unFriend = function (roomId, friendId, currentUserId) {
  console.log("hey");

  // delete the room with room id
  // delete that friend info from current user profile
  // and delete current user info from that friend profile
  // that's it
};

export const blockFriend = async function (roomId, type, lastMsgKey) {
  console.log(roomId);
  const db = getDatabase();
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;
  console.log(authUser);
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
