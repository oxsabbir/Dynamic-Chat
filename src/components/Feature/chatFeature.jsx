import { getDatabase, ref, update } from "firebase/database";
export const typingHandler = function (roomId, authUser) {
  const db = getDatabase();
  const messages = {
    isTyping: true,
    from: authUser,
    message: "typing...",
  };
  const updates = {};
  updates["chat-room/" + roomId + `/chats/${"typing"}`] = messages;
  return update(ref(db), updates);
};

export const blurHandler = function (roomId) {
  const db = getDatabase();
  const updates = {};
  updates["chat-room/" + roomId + `/chats/${"typing"}`] = null;

  return update(ref(db), updates);
};
