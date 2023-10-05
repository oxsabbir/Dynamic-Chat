import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useContext, useState } from "react";
import { stateContext } from "./auth/Context";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./UI/Loading";

const RootLayout = function () {
  const auth = getAuth();
  const data = useContext(stateContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (snapshot) => {
      console.log("logged");
      setIsLoading(true);

      if (snapshot) {
        data.setLogin(true);
        navigate("/dashboard");
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      {isLoading && <Loading />}
      <Outlet />
    </>
  );
};

export default RootLayout;
