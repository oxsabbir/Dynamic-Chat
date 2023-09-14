import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useState } from "react";

const UserProfile = function (props) {
  const [userData, setUserData] = useState(null);

  const auth = getAuth();

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
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  // get data from databases
  const getDataHandler = function () {
    const db = getDatabase();
    const detailRef = ref(db, "users/" + auth.currentUser.uid);
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
