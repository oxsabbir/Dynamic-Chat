import classes from "./FallbackMessage.module.css";

const FallbackMessage = function ({ children }) {
  return (
    <>
      <div className={classes.fallback}>
        <h2>{children}</h2>
      </div>
    </>
  );
};

export default FallbackMessage;
