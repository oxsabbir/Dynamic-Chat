import { createContext, useState } from "react";
import { useContext } from "react";

const initialState = {
  isLoggedIn: false,
  setLogin: () => {},
  setLogOut: () => {},
  toggleFriend: () => {},
};

export const stateContext = createContext();

const ContextWrapper = function ({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
  const [show, setShow] = useState(false);

  const setLogin = function () {
    setIsLoggedIn(true);
    console.log("invoked");
    localStorage.setItem("isLoggedIn", "true");
  };
  const setLogOut = function () {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const toggleFriend = function () {
    setShow((prev) => !prev);
  };

  const mainState = {
    isLoggedIn: isLoggedIn,
    setLogin,
    setLogOut,
    toggleFriend,
    show,
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