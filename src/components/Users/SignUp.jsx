import classes from "./SignUp.module.css";
import Button from "../UI/Button/Button";
import GLogo from "../../assets/GLogo.png";
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
import {
  getDatabase,
  onValue,
  ref,
  update,
  serverTimestamp,
} from "firebase/database";
import Loading from "../UI/Loading/Loading";
import { contextData } from "../auth/Context";
import { useNavigate } from "react-router-dom";

const SignUp = function () {
  const { toggleChatBox } = contextData();
  const navigate = useNavigate();
  const enteredName = useRef();
  const enteredPassword = useRef();
  const enteredEmail = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const [hasError, setHasError] = useState({ error: false, message: "null" });

  const auth = getAuth();

  const [isSignIn, setIsSignIn] = useState(true);

  const writeUserData = function (name, email, userId, isVerifyed, photoUrl) {
    const db = getDatabase();

    const userRef = ref(db, "users/" + userId);

    let userData = {
      email: email,
      userName: name,
      isVerifyed,
      uid: userId,
      isActive: {
        isActive: true,
        time: serverTimestamp(),
      },
    };

    if (photoUrl) {
      userData.profilePic = photoUrl;
    }

    let updates = {};
    updates[`users/${userId}`] = userData;

    onValue(userRef, (snap) => {
      // blocking reWriting if old user signin
      const data = snap.val();
      if (!data?.uid) {
        console.log("can write");
        return update(ref(db), updates).then(() => console.log("user Created"));
      }
    });

    // Stop reWriting if already data exist
  };

  const createNewAccount = function (event) {
    event.preventDefault();
    const email = enteredEmail.current?.value;
    const password = enteredPassword.current?.value;
    const userName = enteredName.current?.value;

    // validation
    if (!email || !password || !userName) {
      !password ? enteredPassword.current.focus() : "";
      !email ? enteredEmail.current.focus() : "";
      !userName ? enteredName.current.focus() : "";
      return;
    }

    setIsLoading(true);

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
        setIsLoading(false);
        toggleChatBox(false);
      })
      .then(() => navigate("/dashboard"))
      .catch((err) => {
        setIsLoading(false);
        setHasError({ error: true, message: err.message });
      });
  };

  const signUpWithGoogle = function (e) {
    e.preventDefault();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        const user = result.user;

        console.log("going");
        writeUserData(
          user.displayName,
          user.email,
          user.uid,
          user.emailVerified,
          user.photoURL
        );
        toggleChatBox(false);
      })
      .then(() => navigate("/dashboard"))
      .catch((error) => {
        console.log(error);
      });
  };

  const userLoginHandler = function (e) {
    e.preventDefault();
    const email = enteredEmail.current.value;
    const password = enteredPassword.current.value;
    console.log(email, password);
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((info) => {
        console.log(info);
        setIsLoading(false);
        toggleChatBox();
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err.message);
        setHasError({ error: true, message: err.message });
        enteredPassword.current.focus();
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className={classes.center}>
        <form
          action=""
          onSubmit={createNewAccount}
          className={classes.form_elements}
        >
          {isLoading && <Loading />}

          <h2>{isSignIn ? "Sign Up" : "Login"}</h2>
          {isSignIn && (
            <>
              <label htmlFor="name">Full Name</label>
              <input
                ref={enteredName}
                type="text"
                required
                maxLength={20}
                name="username"
              />
            </>
          )}

          {hasError.error && <h3>{hasError.message}</h3>}

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
              Or if you already have an account, <br />
              <span onClick={() => setIsSignIn(false)}>Login</span>
            </p>
          )}
          {!isSignIn && (
            <p className={classes.loginBtn}>
              Back to Register Form, <br />
              <span onClick={() => setIsSignIn(true)}>Signup</span>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default SignUp;
