import classes from "./MessageMenu.module.css";
import { typingHandler, blurHandler } from "../Feature/chatFeature";
import { useState, useRef } from "react";
import { getDatabase, ref, push, child } from "firebase/database";
import { getStorage, ref as imageRef } from "firebase/storage";
import { messagesSender as sendMsg } from "../Message/messageSender";
import { getAuth } from "firebase/auth";
import { icons } from "../UI/Icons";
import Button from "../UI/Button/Button";
import uploadMedia from "../Feature/uploadMedia";

const MessageMenu = function ({
  roomId,
  authUser,
  userId,
  groupOpen,
  blocked,
}) {
  const auth = getAuth();
  const enteredMessage = useRef();
  const enteredFile = useRef();

  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileSelection = function (event) {
    const files = event.target.files[0];
    const imageUrlSelect = URL.createObjectURL(files);
    setIsImageSelected(imageUrlSelect);
  };

  const messageSender = async function () {
    await sendMsg(...arguments).then(() => {
      enteredMessage.current.value = "";
      enteredMessage.current.focus();
      enteredFile.current.value = "";
      setIsLoading(false);
      setIsImageSelected(false);
    });
  };

  const sendMessage = async function (event) {
    event.preventDefault();
    const db = getDatabase();
    const message = enteredMessage.current?.value;
    if (message.trim().length <= 0 && !isImageSelected) {
      enteredMessage.current.focus();
      return;
    }
    // generating new key for message
    const newKey = push(child(ref(db), "friends/")).key;

    // Seding message with an image
    const file = enteredFile.current.files[0];
    const storage = getStorage();
    const picRef = imageRef(
      storage,
      `image/chats/${roomId}/${auth.currentUser.uid}/${newKey}`
    );

    if (isImageSelected) {
      setIsLoading(true);
      // uploading pic and showing to chat
      uploadMedia(file, picRef, messageSender, [
        roomId,
        authUser,
        userId,
        message,
        newKey,
        groupOpen,
      ]);
    }
    // Sending only text message without image
    if (!isImageSelected) {
      messageSender(
        roomId,
        auth.currentUser.uid,
        userId,
        message,
        newKey,
        groupOpen
      );
    }
  };

  const openInput = function () {
    enteredFile.current.click();
  };

  const closeInput = function () {
    setIsImageSelected(false);
    enteredFile.current.value = "";
  };
  return (
    <>
      <form onSubmit={sendMessage} name="message">
        <div
          className={`${classes.bottomOption} ${
            blocked.blocked ? classes.hidden : ""
          }`}
        >
          <>
            <input
              className={classes.hidden}
              ref={enteredFile}
              type="file"
              onChange={fileSelection}
              accept=".png,.jpg,.jpeg,.gif"
            />
            {isImageSelected && (
              <div className={classes.selectedImage}>
                <img src={isImageSelected} alt="image-selected" />
                <span onClick={closeInput}>{icons.remove}</span>
              </div>
            )}
            {!isImageSelected && (
              <Button onMouseUp={openInput}>{icons.image}</Button>
            )}

            <input
              ref={enteredMessage}
              type="text"
              onChange={() => typingHandler(roomId, authUser)}
              placeholder="Type here..."
              onBlur={() => blurHandler(roomId)}
            />
            <Button disabled={isLoading} type={"submit"}>
              {isLoading ? "..." : icons.send}
            </Button>
          </>
        </div>
      </form>
    </>
  );
};

export default MessageMenu;
