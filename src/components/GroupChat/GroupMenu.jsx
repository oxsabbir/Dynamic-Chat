import Button from "../UI/Button/Button";
import classes from "./GroupMenu.module.css";
import DangerButton from "../UI//Button/DangerButton";
import { useState } from "react";
import { icons } from "../UI/Icons";
import { getAuth } from "firebase/auth";
import { contextData } from "../auth/Context";
import GetProfile from "./GetProfile";
import { getDatabase, update, ref, push, child } from "firebase/database";

const GroupMenu = function ({ memberList, groupInfo }) {
  const { toggleChatBox, toggleInbox } = contextData();

  const { acceptedFriend, currentUserData } = contextData();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const auth = getAuth();

  const removeMemberHandler = async function (event) {
    const db = getDatabase();
    const roomId = groupInfo.roomId;
    const refId = event.target.dataset.refid;
    const getUser = memberList.find((user) => user.id === refId);
    let newKey = push(child(ref(db), "friends/")).key;

    const requireUser = event.target.id;
    const removeStatus = {
      type: "status",
      title: `${currentUserData.userName} removed ${getUser?.userName} from the group`,
    };

    const removeUser = {};

    removeUser[`users/${requireUser}/friends/${roomId}`] = null;
    removeUser[`chat-room/${roomId}/roomMember/${refId}`] = null;
    removeUser[`chat-room/${roomId}/chats/${newKey}`] = removeStatus;

    return update(ref(db), removeUser).then(() => {
      console.log("success");
    });
  };

  const leaveGroupHandler = async function () {
    const db = getDatabase();
    const roomId = groupInfo.roomId;
    const userId = auth.currentUser.uid;
    const refId = memberList.find((item) => item.uid === userId);

    let newKey = push(child(ref(db), "friends/")).key;
    const leaveStatus = {
      type: "status",
      title: `${currentUserData.userName} left the group`,
    };

    const leaveUpdate = {};
    leaveUpdate[`users/${userId}/friends/${roomId}`] = null;
    leaveUpdate[`chat-room/${roomId}/roomMember/${refId.id}`] = null;

    leaveUpdate[`chat-room/${roomId}/chats/${newKey}`] = leaveStatus;

    return update(ref(db), leaveUpdate).then(() => {
      toggleChatBox(false);
      toggleInbox();
    });
  };

  return (
    <>
      <div className={classes.groupMenu}>
        {isAdding && (
          <div className={classes.searchUser}>
            <input
              type="search"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Type a friend name"
            />
          </div>
        )}

        {isAdding && (
          <div
            className={`${classes.userListAdding} ${classes.memberList} ${classes.showMember}`}
          >
            {acceptedFriend.map((accepted, i) => {
              if (accepted.type === "group") return;

              const alreadyAdded = memberList.find((item) => {
                if (item?.uid === accepted?.userId) return true;
                if (item?.uid !== accepted?.userId) return false;
              });

              if (alreadyAdded) return;
              const names = accepted.name;
              const isExist = names.toLowerCase();
              if (
                searchInput.trim().length !== 0 &&
                !isExist.startsWith(searchInput.toLowerCase())
              ) {
                return;
              }
              return (
                <GetProfile
                  key={i}
                  userId={accepted.userId}
                  roomId={groupInfo.roomId}
                  groupInfo={groupInfo}
                />
              );
            })}
          </div>
        )}

        {!isAdding && (
          <>
            <div
              onClick={() => setIsVisible((prev) => !prev)}
              className={classes.toogleMember}
            >
              <h4>Group Member</h4>
              <span>{isVisible ? icons.dropUp : icons.dropDown}</span>
            </div>
            <div
              className={`${classes.memberList} ${
                isVisible && classes.showMember
              }`}
            >
              {memberList.map((item) => (
                <div key={item.uid} className={classes.friendList}>
                  <div className={classes.friendCard}>
                    <img src={item?.profilePic} />
                    <h3>{item.userName}</h3>
                    {item.uid === groupInfo?.admin && <h5>Admin</h5>}
                    {item.uid !== groupInfo?.admin &&
                      groupInfo?.admin === auth.currentUser?.uid && (
                        <DangerButton
                          id={item.uid}
                          data-refid={item.id}
                          onClick={removeMemberHandler}
                        >
                          Remove
                        </DangerButton>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={classes.option}>
          <Button onClick={() => setIsAdding((prev) => !prev)}>
            {isAdding ? "Cancel" : "Add People"}
          </Button>
          <div className={classes.confirmModal}>
            {!isLeaving && (
              <DangerButton onClick={() => setIsLeaving(true)}>
                Leave Group
              </DangerButton>
            )}
            {isLeaving && (
              <>
                <Button onClick={() => setIsLeaving(false)}>Cancel</Button>
                <DangerButton onClick={leaveGroupHandler}>Confirm</DangerButton>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupMenu;
