import { useEffect, useRef, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import "./App.css";
import UserProfile from "./components/UserProfile";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  // chechikng if user logged in or not
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (userData) => {
      console.log(userData);
      if (userData) {
        setIsLogin(true);
        setUser(userData.email);
      } else {
        setIsLogin(null);
      }
    });
  }, []);

  return (
    <>
      <h1>FireBase Auth Practice</h1>
      {isLogin && <UserProfile user={user} />}

      {console.log(isLogin)}

      {!isLogin && <SignUp auth={auth} />}
      {!isLogin && <Login auth={auth} />}
    </>
  );
}

export default App;
