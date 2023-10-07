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
  const { isInboxOpen, setLogOut, toggleFriend } = useContext(stateContext);

  const logOutHandler = function () {
    auth.signOut().then(() => setLogOut());
    navigate("/");
  };

  return (
    <>
      <nav
        className={`${classes.navBar} ${isInboxOpen ? classes.hidebody : ""}`}
      >
        <ListPrinter>
          <li>
            <Button onClick={toggleFriend}>{icons.showRequest}</Button>
          </li>

          <li>
            <Button>{icons.chat}</Button>
          </li>
          <li>
            <Button onClick={logOutHandler}>{icons.logout}</Button>
          </li>
        </ListPrinter>
      </nav>
    </>
  );
};

export default MobileUi;
