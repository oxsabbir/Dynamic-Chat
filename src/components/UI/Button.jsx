import classes from "./Button.module.css";
const Button = function (props) {
  return (
    <>
      <button {...props} className={classes.button}>
        {props.children}
      </button>
    </>
  );
};

export default Button;
