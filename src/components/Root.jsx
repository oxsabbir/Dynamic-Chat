import classes from "./Home.module.css";
import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { stateContext } from "./auth/Context";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./UI/Loading";

const RootLayout = function () {
  const auth = getAuth();
  const { setLogin } = useContext(stateContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
