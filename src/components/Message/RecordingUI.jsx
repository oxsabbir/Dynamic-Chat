import { useEffect, useState } from "react";
import classes from "./RecordingUi.module.css";

const RecordingUI = function () {
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    let timeout;
    timeout = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(timeout);
    };
  }, []);
  return (
    <>
      <div className={classes.recorder}>
        <div className={`${classes.pulseDot} ${classes.pulseAnim}`}></div>
        <p>{timer} second</p>
      </div>
    </>
  );
};
export default RecordingUI;
