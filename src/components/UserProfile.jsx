import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useRef, useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const UserProfile = function (props) {
  const userId = useRef();
  const [userData, setUserData] = useState(null);

  // using fireStore
  const db = getDatabase();

  const auth = getAuth();

  const AddFriend = function () {
    const id = userId.current.value;
    console.log(id);
    set(ref(db, "users/" + `${id}/` + "friends"), {
      userId: auth.currentUser.uid,
      roomID: "msgRoom2",
    });
  };

  const acceptFriend = function () {
    const id = false;

    const dbref = ref(db, `users/${id}/friends`);
  };

  const logOutHandler = function () {
    auth
      .signOut()
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // instert data into databases

  const writeData = function () {
    const db = getDatabase();
    set(ref(db, "users/" + auth.currentUser.uid), {
      userName: "oxsabbir",
      email: auth.currentUser.email,
      isVerifyed: auth.currentUser.emailVerified,
      friends: [{ user: "user1", roomId: "room1" }],
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  // get data from databases
  const getDataHandler = function () {
    const db = getDatabase();
    // console.log(auth.currentUser.uid, "iddddd");
    const detailRef = ref(db, "users/");
    console.log(detailRef);

    onValue(detailRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setUserData(data);
    });
  };

  return (
    <>
      <h4>{auth.currentUser.uid}</h4>
      <h1>${props.user}</h1>
      <button onClick={logOutHandler}>Logout</button>
      <button onClick={writeData}>save it</button>
      <button onClick={getDataHandler}>getData</button>
      <input type="text" ref={userId} />
      <button onClick={AddFriend}>AddFriend</button>
      <button onClick={acceptFriend}>accept friend</button>
      {userData && (
        <ul>
          <li>UserName : {userData.userName}</li>
          <li>Email : {userData.email}</li>
          <li>verify : {userData.isVerifyed.toString()}</li>
        </ul>
      )}
    </>
  );
};

export default UserProfile;
