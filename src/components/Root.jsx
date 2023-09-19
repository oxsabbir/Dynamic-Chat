import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useContext } from "react";
import { stateContext } from "./auth/Context";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const RootLayout = function () {
  const auth = getAuth();
  const data = useContext(stateContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (snapshot) => {
      if (snapshot) {
        data.setLogin(true);
        navigate("/dashboard");
      }
    });
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default RootLayout;
