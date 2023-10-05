import { createContext, useState } from "react";
import { useContext } from "react";

const initialState = {
  isLoggedIn: false,
  setLogin: () => {},
  setLogOut: () => {},
  toggleFriend: () => {},
  toggleInbox: () => {},
  toggleActiveChat: () => {},
};

export const stateContext = createContext();

const ContextWrapper = function ({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
  const [show, setShow] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("");

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
  const toggleInbox = function () {
    setIsInboxOpen((prev) => !prev);
  };

  const toggleActiveChat = function (uid) {
    setActiveChat(uid);
  };

  const mainState = {
    isLoggedIn: isLoggedIn,
    setLogin,
    setLogOut,
    toggleFriend,
    toggleInbox,
    show,
    isInboxOpen,
    activeChat,
    toggleActiveChat,
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
