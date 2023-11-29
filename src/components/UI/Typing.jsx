import classes from "./Typing.module.css";
const Typing = function () {
  return (
    <>
      <div className={classes.ticontainer}>
        <div className={classes.tiblock}>
          <div className={classes.tidot}></div>
          <div className={classes.tidot}></div>
          <div className={classes.tidot}></div>
        </div>
      </div>
    </>
  );
};

export default Typing;
