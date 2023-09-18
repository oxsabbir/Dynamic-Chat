import classes from "./SignUp.module.css";
import Button from "./UI/Button";
import GLogo from "../assets/Glogo.png";
import { useState } from "react";
import { useRef } from "react";
const SignUp = function () {
  const enteredName = useRef();
  const enteredPassword = useRef();
  const enteredEmail = useRef();

  const [isSignIn, setIsSignIn] = useState(true);

  const createNewAccount = function (event) {
    event.preventDefault();
    console.log("clicked");
  };

  const signUpWithGoogle = function (e) {
    e.preventDefault();
    console.log("with google");
  };

  return (
    <>
      <div className={classes.center}>
        <form
          action=""
          onSubmit={createNewAccount}
          className={classes.form_elements}
        >
          <h2>{isSignIn ? "Sign Up" : "Login"}</h2>
          {isSignIn && (
            <>
              <label htmlFor="name">Full Name</label>
              <input ref={enteredName} type="text" name="username" />
            </>
          )}
          <label htmlFor="email">Email</label>
          <input ref={enteredEmail} type="email" required />
          <label htmlFor="signup">Password</label>
          <input
            ref={enteredPassword}
            type="password"
            min={6}
            step={1}
            required
          />
          {isSignIn && <Button type="submit">Register Now</Button>}
          {!isSignIn && <Button type="submit">Login</Button>}
          <div className={classes.google_btn}>
            <Button onClick={signUpWithGoogle}>
              <img src={GLogo} />
              <p>Continue with Google</p>
            </Button>
          </div>
          {isSignIn && (
            <p className={classes.loginBtn}>
              Or if you already have an account,
              <span onClick={() => setIsSignIn(false)}>Login</span>
            </p>
          )}
          {!isSignIn && (
            <p className={classes.loginBtn}>
              Back to Register Form,
              <span onClick={() => setIsSignIn(true)}>Signup</span>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default SignUp;
