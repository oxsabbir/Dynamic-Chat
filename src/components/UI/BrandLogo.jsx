import classes from "./BrandLogo.module.css";
import { contextData } from "../auth/Context";
const BrandLogo = function () {
  const { isDarkTheme } = contextData();
  return (
    <>
      <div className={classes.brandLogo}>
        <h2
          className={`${
            isDarkTheme ? classes.darkHeading : classes.lightHeading
          }`}
        >
          Dynamic Chat
        </h2>
      </div>
    </>
  );
};

export default BrandLogo;
