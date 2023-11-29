import classes from "./MobileUI.module.css";
import ListPrinter from "../ListPrinter";
import Button from "../Button/Button";
import { icons } from "../Icons";
import { useContext } from "react";
import { stateContext } from "../../auth/Context";
const MobileUi = function () {
  const {
    isInboxOpen,
    toggleFriend,
    toggleSetting,
    togglePeople,
    isDarkTheme,
    toggleTheme,
  } = useContext(stateContext);

  const themeHandler = function () {
    toggleTheme(!isDarkTheme);
    localStorage.setItem("darkMode", !isDarkTheme);
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
