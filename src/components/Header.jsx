import classes from "./Header.module.css";
import Button from "./UI/Button";
import brandLogo from "../assets/brandLogo.png";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { stateContext } from "./auth/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ShowRequest from "./Dashboard/ShowRequest";

const Header = function () {
  const navigate = useNavigate();
  const auth = getAuth();
  const data = useContext(stateContext);
  const toggleFriend = data.toggleFriend;
  const uid = auth?.currentUser?.uid;

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
                  {data.show ? "Hide Request" : "Show Request"}
                </Button>
              )}
            </li>
            <li>
              <Button>
                <Link to={"/dashboard"}>Dashboard</Link>
              </Button>
            </li>
            <li>
              {data.isLoggedIn && (
                <Button onClick={LogoutHandler}>Logout</Button>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
