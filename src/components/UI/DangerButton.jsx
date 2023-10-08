import classes from "./Button.module.css";

const DangerButton = function (props) {
  return (
    <>
      <button {...props} className={classes.buttonDanger}>
        {props.children}
      </button>
    </>
  );
};

export default DangerButton;
