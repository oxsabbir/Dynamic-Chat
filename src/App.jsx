import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";
import { getAuth } from "firebase/auth";
import "./App.css";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import FindFriend from "./components/Dashboard/FindFriend";
import Inbox from "./components/Dashboard/Inbox";
import Chat from "./components/Dashboard/Chat";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  useEffect(() => {
    onAuthStateChanged(auth, (snapshot) => {
      console.log(snapshot);
    });
  }, []);

  return (
    <>
      {/* <Header />
      <SignUp /> */}
      {/* <FindFriend /> */}
      {/* <Inbox /> */}
      <Chat />
    </>
  );
}

export default App;
