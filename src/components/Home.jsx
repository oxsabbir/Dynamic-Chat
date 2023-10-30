import classes from "./Home.module.css";
import SignUp from "./SignUp";
const Home = function () {
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.mainContent}>
          <div className={classes.loginPage}></div>
          <div className={classes.signup}>
            <SignUp />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
