import classes from "./ImageModal.module.css";
import { createPortal } from "react-dom";
import Button from "../Button/Button";
import { icons } from "../Icons";

const ImageModal = function ({ children, onClose, isOpen, image }) {
  if (!isOpen) return;

  const downLoadImage = function () {
    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = `message${Math.random().toFixed(4)}.jpg`;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      })
      .catch((err) => console.error("Error during downloading image : ", err));
  };

  return createPortal(
    <>
      <div onClick={onClose} className={classes.overlay}></div>
      <div className={classes.modal}>
        <div className={classes.mainContent}>
          {children}

          <div className={classes.options}>
            <Button onClick={downLoadImage}>{icons.download}</Button>
            <Button onClick={onClose}>{icons.remove}</Button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default ImageModal;
