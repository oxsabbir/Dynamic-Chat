import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";

const Login = function ({ auth }) {
  const enteredEmail = useRef();
  const enteredPass = useRef();

  const signInHandler = function (events) {
    events.preventDefault();
    const email = enteredEmail.current.value;
    const pass = enteredPass.current.value;
    console.log(email, pass);

    // firebase auth useCreation
    signInWithEmailAndPassword(auth, email, pass)
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

  return (
    <>
      <h2>Sign in</h2>
      <form onSubmit={signInHandler}>
        <label htmlFor="Email">Email</label>
        <input ref={enteredEmail} type="email" required />
        <label htmlFor="Password">Password</label>
        <input ref={enteredPass} type="password" required />
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default Login;
