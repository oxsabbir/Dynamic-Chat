import classes from "./ConfirmationBox.module.css";
import Button from "./Button";
import DangerButton from "./DangerButton";

import { unFriend, blockFriend } from "../Friend/manageFriend";

const ConfirmationBox = function ({
  message,
  getBack,
  job,
  roomId,
  closeModal,
}) {
  const requireActionHandler = async function () {
    if (job === "block") {
      const state = await blockFriend(roomId);
      state ? closeModal() : "";
    }
    if (job === "unfriend") {
      console.log("removed");
      unFriend();
    }
  };

  return (
    <>
      <div className={classes.confirmationBox}>
        <div className={classes.mainBox}>
          <h2>Are you sure ?</h2>
          <p>{message}</p>

          <DangerButton onClick={requireActionHandler}>Yes</DangerButton>
          <Button onClick={getBack}>No</Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationBox;
