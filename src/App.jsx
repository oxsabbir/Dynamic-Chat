import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";
import { getAuth } from "firebase/auth";
import "./App.css";
import SignUp from "./components/SignUp";
import FindFriend from "./components/Dashboard/FindFriend";
import Inbox from "./components/Dashboard/Inbox";
import Chat from "./components/Dashboard/Chat";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([{ path: "/", element: <Home /> }]);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (snapshot) => {
      console.log(snapshot);
    });
    return unsubcribe();
  }, []);

  return (
    <>
      {/* <Header />
      <SignUp /> */}
      {/* <FindFriend /> */}
      {/* <Inbox /> */}
      {/* <Chat /> */}

      <RouterProvider router={router} />
    </>
  );
}

export default App;
