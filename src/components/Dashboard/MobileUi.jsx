import classes from "./MobileUI.module.css";
import ListPrinter from "../UI/ListPrinter";
import Button from "../UI/Button";
import { icons } from "../UI/Icons";
import { useContext } from "react";
import { stateContext } from "../auth/Context";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const MobileUi = function () {
  const navigate = useNavigate();
  const auth = getAuth();
  const {
    isInboxOpen,
    setLogOut,
    toggleFriend,
    toggleSetting,
    togglePeople,
    isDarkTheme,
    toggleTheme,
  } = useContext(stateContext);

  const themeHandler = function () {
    toggleTheme(!isDarkTheme);
  };

  return (
    <>
      <nav
        className={`${classes.navBar} ${isInboxOpen ? classes.hidebody : ""}`}
      >
        <ListPrinter>
          <li>
            <Button onClick={togglePeople}>{icons.peopleGroup}</Button>
          </li>
          <li>
            <Button onClick={toggleFriend}>{icons.showRequest}</Button>
          </li>
          <li>
            <Button onClick={themeHandler}>
              {isDarkTheme ? icons.switchOn : icons.switchOff}
            </Button>
          </li>
          <li>
            <Button onClick={toggleSetting}>{icons.setting}</Button>
          </li>
        </ListPrinter>
      </nav>
    </>
  );
};

export default MobileUi;
