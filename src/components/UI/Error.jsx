import classes from "./Error.module.css";
import { useRouteError } from "react-router-dom";
const Error = function () {
  const error = useRouteError();
  return (
    <>
      <div className={classes.error}>
        <h2>Something went wrong</h2>
        <p>Define your errors</p>
      </div>
    </>
  );
};

export default Error;
