import Button from "../UI/Button/Button";
import classes from "./BlockHandler.module.css";
import { blockFriend } from "../Friend/manageFriend";

const BlockHandler = function ({ blocked, isBlockedFromMe, roomId }) {
  const unBlockHandler = function () {
    const blockId = blocked.blockId;
    blockFriend(roomId, "unblock", blockId);
  };

  return (
    <>
      {blocked.blockId && (
        <div className={classes.blockedUi}>
          {isBlockedFromMe ? (
            <Button onClick={unBlockHandler}>Unblock</Button>
          ) : (
            <p>
              You can't communicate with this person anymore. <br />
              For some reason this person <span>Blocked</span> your account.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default BlockHandler;
