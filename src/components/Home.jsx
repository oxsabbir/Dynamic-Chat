import classes from "./Home.module.css";
import SignUp from "./SignUp";
import Brandlogo from "./UI/BrandLogo";
const Home = function () {
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.mainContent}>
          <div className={classes.loginPage}>
            <Brandlogo />
          </div>
          <div className={classes.signup}>
            <SignUp />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
