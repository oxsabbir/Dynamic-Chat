import { getDatabase, ref, update } from "firebase/database";
export const cancelRequest = function (userId, roomId) {
  const db = getDatabase();
  const updatesRef = {};

  updatesRef[`users/${userId}/friends/${roomId}`] = null;
  updatesRef[`chat-room/${roomId}`] = null;

  console.log(updatesRef);

  return update(ref(db), updatesRef);
};
