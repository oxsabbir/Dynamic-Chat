import classes from "./SideLayout.module.css";
import Button from "../UI/Button/Button";
import { icons } from "../UI/Icons";
const SideLayout = function ({ backHandler, title, children, isShown }) {
  return (
    <div
      className={`${classes.layout} ${isShown ? classes.show : classes.hide}`}
    >
      <div className={classes.layoutBar}>
        <h2>{title}</h2>
        <Button onClick={backHandler}>{icons.back}</Button>
      </div>
      {children}
    </div>
  );
};

export default SideLayout;
