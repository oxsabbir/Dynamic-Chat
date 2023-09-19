import classes from "./Header.module.css";
import Button from "./UI/Button";
import brandLogo from "../assets/brandLogo.png";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { stateContext } from "./auth/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Header = function () {
  const navigate = useNavigate();
  const auth = getAuth();
  const data = useContext(stateContext);

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
              <Button>
                <Link to={"/dashboard"}>Dashboard</Link>
              </Button>
            </li>
            <li>
              <Button>How it work's</Button>
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
