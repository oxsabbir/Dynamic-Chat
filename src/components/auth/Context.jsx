import { createContext, useState } from "react";
import { useContext } from "react";

const initialState = {
  isLoggedIn: false,
  setLogin: () => {},
  setLogOut: () => {},
};

export const stateContext = createContext();

const ContextWrapper = function ({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);

  const setLogin = function () {
    setIsLoggedIn(true);
    console.log("invoked");
  };
  const setLogOut = function () {
    setIsLoggedIn(false);
  };

  const mainState = {
    isLoggedIn: isLoggedIn,
    setLogin,
    setLogOut,
  };

  return (
    <>
      <stateContext.Provider value={mainState}>
        {children}
      </stateContext.Provider>
    </>
  );
};

export default ContextWrapper;
