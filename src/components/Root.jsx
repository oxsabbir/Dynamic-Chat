import classes from "./Home/Home.module.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./UI/Loading/Loading";
import { contextData } from "./auth/Context";
import {
  update,
  ref,
  getDatabase,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";

const RootLayout = function () {
  const auth = getAuth();
  const navigate = useNavigate();
  const { toggleTheme, setLogin, isDarkTheme } = contextData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Setting theme
    let darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = localStorage.getItem("darkMode");
    if (currentTheme === "true") {
      toggleTheme(true);
      darkTheme = false;
    }
    if (currentTheme === "false") {
      toggleTheme(false);
      darkTheme = false;
    }
    if (darkTheme) {
      toggleTheme(true);
      localStorage.setItem("darkMode", true);
    }

    setLoading(true);
    const unsubcribe = onAuthStateChanged(auth, (snapshot) => {
      if (snapshot) {
        setLogin(true);
        navigate("/dashboard");
        setLoading(false);
        const db = getDatabase();

        const disconnectRef = ref(
          db,
          `users/${auth.currentUser.uid}/isActive/isActive`
        );
        // setting status to active
        const isActiveState = {
          isActive: true,
          time: serverTimestamp(),
        };
        const userStatus = {};
        userStatus[`users/${auth.currentUser.uid}/isActive`] = isActiveState;

        // setting active to deactive when app if offline
        onDisconnect(disconnectRef).set(false);

        return update(ref(db), userStatus);
      }
      if (!snapshot) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      {loading && (
        <div
          className={`${classes.loadingState} ${
            isDarkTheme ? classes.loadingStateDark : classes.loadingStateLight
          }`}
        >
          <Loading />
          <p>
            Authentication complete <br />
            Now redirecting dashboard <br /> please wait a second
          </p>
        </div>
      )}

      {!loading && (
        <>
          <Outlet />
        </>
      )}
    </>
  );
};

export default RootLayout;
