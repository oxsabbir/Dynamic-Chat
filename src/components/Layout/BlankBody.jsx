import classes from "./BlankBody.module.css";
import { icons } from "../UI/Icons";
const BlankBody = function () {
  return (
    <>
      <div className={classes.blank}>
        {icons.inbox}
        <p>Make Friends And Share Your Thoughts</p>
      </div>
    </>
  );
};

export default BlankBody;
