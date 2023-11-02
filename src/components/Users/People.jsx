import classes from "./People.module.css";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import ListPrinter from "../UI/ListPrinter";
import FriendList from "../Friend/FriendList";
import { contextData } from "../auth/Context";
import Button from "../UI/Button/Button";
import Loading from "../UI/Loading/Loading";
import SideLayout from "../Layout/SideLayout";
import CreateGroup from "../GroupChat/CreateGroup";

const People = function ({ authUid, userInfo, acceptedFriend }) {
  const { isPeopleOpen, togglePeople } = contextData();
  const [isGroupCreating, setIsGroupCreating] = useState(false);
  const db = getDatabase();
  const allUsers = ref(db, "/users");
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!isPeopleOpen) return;
    onValue(allUsers, (snaps) => {
      const data = snaps.val();
      const values = Object.values(data);
      setIsLoading(false);
      setUserData(values);
    });
  }, [isPeopleOpen]);
  const createGroupHandler = function () {
    setIsGroupCreating(true);
  };
  const backHandler = function () {
    setIsGroupCreating(false);
  };

  return (
    <>
      {!isGroupCreating && (
        <SideLayout
          title={"Explore People"}
          isShown={isPeopleOpen}
          backHandler={togglePeople}
        >
          <div className={classes.peoples}>
            {isLoading && <Loading />}
            <ListPrinter>
              {userData.length > 0 &&
                userData?.map((item) => (
                  <li key={item.uid}>
                    <FriendList
                      item={item}
                      authUid={authUid}
                      userInfo={userInfo}
                    />
                  </li>
                ))}
            </ListPrinter>
          </div>

          <div className={classes.groupButton}>
            <Button onClick={createGroupHandler}>Create Group</Button>
          </div>
        </SideLayout>
      )}
      {isGroupCreating && (
        <CreateGroup
          isShown={isGroupCreating}
          getBack={backHandler}
          acceptedFriend={acceptedFriend}
          allUser={userData}
        />
      )}
    </>
  );
};

export default People;
