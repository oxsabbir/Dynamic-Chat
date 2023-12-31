import classes from "./Header.module.css";
import Button from "../UI/Button/Button";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { icons } from "../UI/Icons";
import { contextData } from "../auth/Context";
import BrandLogo from "../UI/BrandLogo";
import makeOffline from "../Feature/makeOffline";

const Header = function () {
  const navigate = useNavigate();
  const auth = getAuth();
  const {
    toggleFriend,
    isLoggedIn,
    setLogOut,
    toggleSetting,
    togglePeople,
    toggleTheme,
    isDarkTheme,
  } = contextData();

  const LogoutHandler = function () {
    makeOffline().then(() => auth.signOut().then(() => setLogOut(false)));
    navigate("/");
  };

  const themeHandler = function () {
    toggleTheme(!isDarkTheme);
    localStorage.setItem("darkMode", !isDarkTheme);
  };

  return (
    <>
      <header>
        <nav className={`${classes.navbar}`}>
          <BrandLogo />

          {isLoggedIn && (
            <ul>
              <li>
                <Button onClick={themeHandler} title={"Change theme"}>
                  {isDarkTheme ? icons.switchOn : icons.switchOff}
                </Button>
              </li>
              <li>
                <Button onClick={togglePeople} title={"Explore"}>
                  {icons.peopleGroup}
                </Button>
              </li>
              <li>
                <Button onClick={toggleFriend} title={"Friend Request"}>
                  {icons.showRequest}
                </Button>
              </li>
              <li>
                <Button onClick={toggleSetting} title={"Setting"}>
                  {icons.setting}
                </Button>
              </li>
              <li>
                <Button onClick={LogoutHandler} title={"Logout"}>
                  {icons.logout}
                </Button>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
