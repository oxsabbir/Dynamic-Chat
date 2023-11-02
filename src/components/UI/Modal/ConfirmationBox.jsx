import classes from "./ConfirmationBox.module.css";
import Button from "../Button/Button";
import DangerButton from "../Button/DangerButton";
import { unFriend, blockFriend } from "../../Friend/manageFriend";
import { contextData } from "../../auth/Context";

const ConfirmationBox = function ({
  message,
  getBack,
  job,
  userInfo,
  roomId,
  closeModal,
}) {
  const { toggleChatBox, toggleInbox, toggleProfile } = contextData();

  const requireActionHandler = async function () {
    if (job === "block") {
      const blockState = await blockFriend(roomId);
      blockState ? closeModal() : "";
    }

    if (job === "unfriend") {
      const unfriendState = await unFriend(roomId, userInfo.uid);
      if (unfriendState) {
        closeModal();
        toggleChatBox(false);
        toggleInbox();
        toggleProfile();
      }
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
