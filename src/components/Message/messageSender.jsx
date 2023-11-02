import { getDatabase, serverTimestamp, update, ref } from "firebase/database";
import { getAuth } from "firebase/auth";

export const messagesSender = async function (
  roomId,
  currentUserId,
  userId,
  message,
  newKey,
  isGroup,
  imageUrl
) {
  const auth = getAuth();
  const authUser = auth?.currentUser?.uid;

  const db = getDatabase();
  const messages = {
    from: authUser,
    names: auth?.currentUser?.displayName,
    message: message,
    id: newKey,
    time: serverTimestamp(),
  };
  if (imageUrl) {
    messages.image = imageUrl;
  }
  const updates = {};
  // updating timestamps on the both side for the sorting
  // these two update are for sorting inbox card
  if (!isGroup) {
    updates[`users/${userId}/friends/${roomId}/lastSent`] = serverTimestamp();
  }
  updates[`users/${currentUserId}/friends/${roomId}/lastSent`] =
    serverTimestamp();
  updates["chat-room/" + roomId + `/chats/${"typing"}`] = null;
  updates["chat-room/" + roomId + `/chats/${newKey}`] = messages;
  // updates["chat-room/" + roomId + "/createdAt"] = serverTimestamp();

  return update(ref(db), updates);
};
