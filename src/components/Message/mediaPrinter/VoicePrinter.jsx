import { useEffect, useRef, useState } from "react";
import classes from "../Message.module.css";
import { icons } from "../../UI/Icons";
import WaveSurfer from "wavesurfer.js";

const VoicePrinter = function ({ item, authUser }) {
  const voiceRef = useRef(null);
  const playVoiceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (voiceRef?.current?.childNodes.length === 1) return;

    const waveSurfer = WaveSurfer.create({
      container: voiceRef.current,
      waveColor: "white",
      progressColor: "gray",
      height: 30,
      url: item.voice,
    });

    waveSurfer.on("interaction", () => {
      waveSurfer.play();
      setIsPlaying(true);
    });

    playVoiceRef.current?.addEventListener("click", function (ev) {
      console.log(ev?.target.classList.contains("fa-play"));

      if (ev?.target.classList.contains("fa-play")) {
        waveSurfer.play();
        setIsPlaying(true);
      } else {
        waveSurfer.pause();
        setIsPlaying(false);
      }
    });
  }, [item.voice]);

  return (
    <>
      <div
        className={`${
          item.from === authUser ? classes.authTextMsg : classes.textMsg
        }`}
      >
        <div className={classes.controller}>
          <span ref={playVoiceRef}>{isPlaying ? icons.pause : icons.play}</span>
          <div ref={voiceRef} className={classes.voiceWave}></div>
        </div>
      </div>
    </>
  );
};

export default VoicePrinter;
