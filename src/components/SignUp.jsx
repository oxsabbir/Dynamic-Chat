import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useRef } from "react";

const SignUp = function ({ auth }) {
  const enteredEmail = useRef();
  const enteredPass = useRef();

  const formHandler = function (events) {
    events.preventDefault();
    const email = enteredEmail.current.value;
    const pass = enteredPass.current.value;
    console.log(email, pass);

    // firebase auth useCreation

    createUserWithEmailAndPassword(auth, email, pass)
      .then((userInfo) => {
        const user = userInfo.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;

        console.log(errorCode, errorMsg);
      });
  };

  // sign in with google
  const googleAuthHandler = function () {
    console.log("sign up");
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // this gives us google acces token we can use it on google api
        const cred = GoogleAuthProvider.credentialFromResult(result);
        const token = cred.accessToken;
        // the signed in user info
        const user = result.user;

        console.log(cred, token, user);
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMsg = err.message;
        console.log(errorCode, errorMsg);
      });
  };
  const googleIn = function () {
    console.log("sign in ");
    const provider = new GoogleAuthProvider();
    // already created account for login
    signInWithRedirect(auth, provider).then((result) => {
      const user = result.user;
      console.log(user);
    });
  };

  return (
    <>
      <h2>Sign Up</h2>
      <form onSubmit={formHandler}>
        <label htmlFor="Email">Email</label>
        <input ref={enteredEmail} type="email" required />
        <label htmlFor="Password">Password</label>
        <input ref={enteredPass} type="password" required />

        <button type="submit">Create An Account</button>
      </form>
      <button onClick={googleAuthHandler}>Sign up with Google</button>
      <button onClick={googleIn}>Sign In with Google</button>
    </>
  );
};

export default SignUp;
