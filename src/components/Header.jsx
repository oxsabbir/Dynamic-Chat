import classes from "./Header.module.css";
import Button from "./UI/Button";
import brandLogo from "../assets/brandLogo.png";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { icons } from "./UI/Icons";
import { contextData } from "./auth/Context";
const Header = function () {
  const navigate = useNavigate();
  const auth = getAuth();
  const { toggleFriend, isLoggedIn, setLogOut, show, toggleSetting } =
    contextData();
  const LogoutHandler = function () {
    auth.signOut().then(() => setLogOut(false));
    navigate("/");
  };

  return (
    <>
      <header>
        <nav className={classes.navbar}>
          <img src={brandLogo} alt="brand-logo" />

          <h2>Let's Begin</h2>
          {isLoggedIn && (
            <ul>
              <li>
                <Button onClick={toggleFriend}>
                  {show ? icons.hideRequest : icons.showRequest}
                </Button>
              </li>
              <li>
                <Button onClick={LogoutHandler}>{icons.logout}</Button>
              </li>
              <li>
                <Button onClick={toggleSetting}>{icons.setting}</Button>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
