import classes from "./Header.module.css";
import Button from "./UI/Button";
import brandLogo from "../assets/brandLogo.png";
const Header = function () {
  return (
    <>
      <header>
        <nav className={classes.navbar}>
          <img src={brandLogo} alt="brand-logo" />
          <ul>
            <li>
              <Button>Dashboard</Button>
            </li>
            <li>
              <Button>How it work's</Button>
            </li>
            <li>
              <Button>About us</Button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
