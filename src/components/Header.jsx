import classes from "./Header.module.css";
import Button from "./UI/Button";
const Header = function () {
  return (
    <>
      <header>
        <nav className={classes.navbar}>
          <h4>Chat'sUp</h4>
          <ul>
            <li>
              <Button>Dashboard</Button>
            </li>
            <li>
              <Button>How it work's</Button>
            </li>
            <li>
              <Button>Sign in</Button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
