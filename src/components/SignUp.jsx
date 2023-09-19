import classes from "./SignUp.module.css";
import Button from "./UI/Button";
import GLogo from "../assets/Glogo.png";
import { useState } from "react";
import { useRef } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const SignUp = function () {
  const enteredName = useRef();
  const enteredPassword = useRef();
  const enteredEmail = useRef();

  const auth = getAuth();

  const [isSignIn, setIsSignIn] = useState(true);

  const writeUserData = function (name, email, userId, isVerifyed) {
    const db = getDatabase();
    const userRef = ref(db, "users/" + userId);
    set(userRef, {
      email: email,
      userName: name,
      isVerifyed,
      uid: userId,
    });
  };

  const createNewAccount = function (event) {
    event.preventDefault();
    const email = enteredEmail.current?.value;
    const password = enteredPassword.current?.value;
    const userName = enteredName.current?.value;

    const updateName = function (name) {
      const auth = getAuth();
      console.log(name);
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(() => {
          console.log("profile updated");
        })
        .catch((err) => console.log(err));
    };

    createUserWithEmailAndPassword(auth, email, password)
      .then((userInfo) => {
        const userId = userInfo.user.uid;
        const isVerifyed = userInfo.user.emailVerified;
        writeUserData(userName, email, userId, isVerifyed);
        updateName(userName);
      })
      .catch((error) => console.log(error));
  };

  const signUpWithGoogle = function (e) {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const user = result.user;

        writeUserData(
          user.displayName,
          user.email,
          user.uid,
          user.emailVerified
        );
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("with google");
  };

  const userLoginHandler = function (e) {
    e.preventDefault();
    const email = enteredEmail.current.value;
    const password = enteredPassword.current.value;
    console.log(email, password);

    signInWithEmailAndPassword(auth, email, password)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => console.log(err));
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
          {isSignIn && (
            <Button onClick={createNewAccount} type="submit">
              Register Now
            </Button>
          )}

          {!isSignIn && (
            <Button onClick={userLoginHandler} type="submit">
              Login
            </Button>
          )}
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
