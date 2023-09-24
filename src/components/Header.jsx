import classes from "./Header.module.css";
import Button from "./UI/Button";
import brandLogo from "../assets/brandLogo.png";
import { getAuth } from "firebase/auth";
import { stateContext } from "./auth/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "./UI/Icons";

const Header = function () {
  const navigate = useNavigate();
  const auth = getAuth();
  const data = useContext(stateContext);
  const toggleFriend = data.toggleFriend;

  const LogoutHandler = function () {
    auth.signOut().then(() => data.setLogOut(false));
    navigate("/");
  };

  return (
    <>
      <header>
        <nav className={classes.navbar}>
          <img src={brandLogo} alt="brand-logo" />
          <ul>
            <li>
              {data.isLoggedIn && (
                <Button onClick={toggleFriend}>
                  {data.show ? icons.hideRequest : icons.showRequest}
                </Button>
              )}
            </li>
            <li>
              {data.isLoggedIn && (
                <Button onClick={LogoutHandler}>{icons.logout}</Button>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
