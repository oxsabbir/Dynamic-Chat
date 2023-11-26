import classes from "../Chat/Chat.module.css";
import ListPrinter from "../UI/ListPrinter";
import Messages from "./Messages";
import GroupChat from "../GroupChat/GroupChat";
import { getDatabase, ref, update } from "firebase/database";
import { useRef } from "react";
import Button from "../UI/Button/Button";

const MessagePrinter = function ({
  message,
  authUser,
  groupOpen,
  roomId,
  profilePic,
  roomMember,
  currentUserData,
  getMoreMessage,
}) {
  const loadingRef = useRef();

  const messageDeleteHandler = async function (event) {
    const messageId = event.target.id;

    const db = getDatabase();
    const updates = {};

    const deleteStatus = {
      type: "status",
      title: `${currentUserData.userName} deleted a message`,
    };
    updates[`chat-room/${roomId}/chats/${messageId}`] = deleteStatus;

    return update(ref(db), updates)
      .then(() => console.log("success"))
      .catch((error) => console.log(error));
  };

  let tempUser = "";

  return (
    <>
      <div className={classes.message}>
        <ListPrinter>
          {message &&
            message.map((item, i) => {
              const sameUser = tempUser === item.from && item.from !== authUser;
              if (item.from !== tempUser) {
                tempUser = item.from;
              }

              if (!groupOpen) {
                return (
                  <Messages
                    key={i}
                    item={item}
                    authUser={authUser}
                    profilePic={profilePic}
                    roomId={roomId}
                    deleteHandler={messageDeleteHandler}
                    sameUser={sameUser}
                  />
                );
              }
              if (groupOpen) {
                const profile = roomMember.find((data) => {
                  if (data.uid === item.from && item.type !== "status") {
                    return data;
                  }
                });
                const pic = profile?.profilePic;
                return (
                  <GroupChat
                    key={i}
                    item={item}
                    authUser={authUser}
                    profilePic={pic}
                    roomId={roomId}
                    deleteHandler={messageDeleteHandler}
                  />
                );
              }
            })}
        </ListPrinter>
        <div
          className={message.length >= 20 ? classes.otherUser : classes.hidden}
          id="loadingSpin"
          ref={loadingRef}
        >
          <Button onClick={getMoreMessage}>Load more</Button>
        </div>
      </div>
    </>
  );
};

export default MessagePrinter;
