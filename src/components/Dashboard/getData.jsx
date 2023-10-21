import { getDatabase, query, ref, limitToLast } from "firebase/database";
import { useState } from "react";
const GetData = function (roomId) {
  const [message, SetMessage] = useState([]);
  const db = getDatabase();
  const chatRef = query(
    ref(db, "chat-room/" + `${roomId}/chats`),
    limitToLast(loadCount)
  );
  onValue(chatRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.val();
    const mainData = Object.values(data);
    SetMessage(mainData);
  });
  return message;
};

export default GetData;
