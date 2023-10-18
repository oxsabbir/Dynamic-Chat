import classes from "./Button.module.css";
import { contextData } from "../auth/Context";
const Button = function (props) {
  const { isDarkTheme } = contextData();

  return (
    <>
      <button
        {...props}
        className={`${classes.button} ${
          isDarkTheme ? classes.buttonDark : classes.buttonLight
        }`}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
