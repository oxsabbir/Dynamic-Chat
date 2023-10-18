import classes from "./Home.module.css";
import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { stateContext } from "./auth/Context";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./UI/Loading";
import { contextData } from "./auth/Context";
const RootLayout = function () {
  const auth = getAuth();
  const { setLogin } = useContext(stateContext);
  const navigate = useNavigate();
  const { toggleTheme } = contextData();
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
      }
      if (!snapshot) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      {loading && (
        <div className={classes.loadingState}>
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
