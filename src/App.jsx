import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";
import { getAuth } from "firebase/auth";
import "./App.css";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
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
    </>
  );
}

export default App;
