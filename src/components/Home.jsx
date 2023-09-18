import Header from "./Header";
import classes from "./Home.module.css";
import SignUp from "./SignUp";
const Home = function () {
  return (
    <>
      <Header />
      <div className={classes.wrapper}>
        <div className={classes.mainContent}>
          <div className="hero">
            <h1>hero</h1>
          </div>
          <div className={classes.signUp}>
            <SignUp />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
