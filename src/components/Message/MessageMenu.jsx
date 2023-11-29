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
import WaveSurfer from "wavesurfer.js";
import RecordingUI from "./RecordingUI";

const MessageMenu = function ({
  roomId,
  authUser,
  userId,
  groupOpen,
  blocked,
}) {
  const auth = getAuth();
  const enteredMessage = useRef(null);
  const enteredFile = useRef(null);
  const voiceWaveRef = useRef(null);
  const playRecordRef = useRef(null);
  const deleteRecordRef = useRef(null);

  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [recordedVoice, setRecordedVoice] = useState("");
  const [currentMedia, setCurrentMedia] = useState({});
  const [isRecordingStart, setIsRecordingStart] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fileSelection = function (event) {
    const files = event.target.files[0];
    const imageUrlSelect = URL.createObjectURL(files);
    setIsImageSelected(imageUrlSelect);
  };

  const messageSender = async function () {
    await sendMsg(...arguments).then(() => {
      if (!recordedVoice) {
        enteredMessage.current.value = "";
        enteredMessage.current.focus();
        enteredFile.current.value = "";
      }
      setIsLoading(false);
      setIsImageSelected(false);
      setRecordedVoice(false);
      setIsRecorded(false);
    });
  };

  const sendMessage = async function (event) {
    event.preventDefault();
    const db = getDatabase();
    const message = enteredMessage.current?.value;

    if (message?.trim().length <= 0 && !recordedVoice && !isImageSelected) {
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
    // sendig voice message
    const voiceRef = imageRef(
      storage,
      `voice/chats/${roomId}/${auth.currentUser.uid}/${newKey}`
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

    if (isRecorded) {
      setIsLoading(true);
      uploadMedia(recordedVoice, voiceRef, messageSender, [
        roomId,
        authUser,
        userId,
        "",
        newKey,
        groupOpen,
        null,
      ]);
    }

    // Sending only text message without image
    if (!isImageSelected && !isRecorded) {
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
    setIsTyping(false);
    enteredFile.current.value = "";
  };

  const getAudioPermission = async function () {
    console.log(await navigator);

    const media = await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audio = new MediaRecorder(stream);
        setCurrentMedia(audio);
        return audio;
      })
      .catch((err) => console.error(err));
    return media;
  };

  const startRecording = async function () {
    const media = await getAudioPermission();
    media.start();
    setIsRecordingStart(true);
    media.addEventListener("dataavailable", function (ev) {
      const blobFile = new Blob([ev.data], { type: "audio/webm;codecs=opus" });
      setRecordedVoice(blobFile);

      const fileLink = URL.createObjectURL(blobFile);

      // Wave surfer
      const waveSurfer = WaveSurfer.create({
        container: voiceWaveRef.current,
        waveColor: "#4F4A85",
        progressColor: "#383351",
        height: 35,
        url: fileLink,
      });
      waveSurfer.on("interaction", () => waveSurfer.play());

      // all about surfer

      const deleteRecording = function () {
        console.log("delete");
        setIsRecorded(false);
        setRecordedVoice("");
        waveSurfer.destroy();
      };
      const playRecording = function () {
        waveSurfer.play();
        console.log("play");
      };
      deleteRecordRef.current.addEventListener("click", deleteRecording);
      playRecordRef.current.addEventListener("click", playRecording);
    });
  };

  const StopRecording = async function () {
    currentMedia.stop();
    setIsRecordingStart(false);
    setIsRecorded(true);
  };

  const toggleMenu = function () {
    setIsTyping(false);
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

            {!isImageSelected && !isTyping && (
              <Button onMouseUp={openInput}>{icons.image}</Button>
            )}
            {!isRecorded && !isTyping && (
              <div>
                <Button
                  onTouchStart={startRecording}
                  onTouchEnd={StopRecording}
                  onMouseDown={startRecording}
                  onMouseUp={StopRecording}
                >
                  {icons.mic}
                </Button>
              </div>
            )}

            {isTyping && !isImageSelected && (
              <Button onMouseUp={toggleMenu}>{icons.arrowRight}</Button>
            )}

            {isRecorded && (
              <div className={classes.controller}>
                <span ref={playRecordRef}>{icons.play}</span>
                <div ref={voiceWaveRef} className={classes.voiceWave}></div>
                <span ref={deleteRecordRef}>{icons.remove}</span>
              </div>
            )}
            {isRecordingStart && <RecordingUI />}

            {!isRecorded && !isRecordingStart && (
              <input
                ref={enteredMessage}
                type="text"
                onChange={() => typingHandler(roomId, authUser)}
                placeholder="Type here..."
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  blurHandler(roomId);
                  setIsTyping(false);
                }}
              />
            )}

            {!isRecordingStart && (
              <Button disabled={isLoading} type={"submit"}>
                {isLoading ? "..." : icons.send}
              </Button>
            )}
          </>
        </div>
      </form>
    </>
  );
};

export default MessageMenu;
