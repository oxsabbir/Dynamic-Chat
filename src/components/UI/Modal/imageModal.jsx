import classes from "./ImageModal.module.css";
import { createPortal } from "react-dom";
import Button from "../Button/Button";
import { icons } from "../Icons";

const ImageModal = function ({ children, onClose, isOpen, image }) {
  if (!isOpen) return;
  return createPortal(
    <>
      <div onClick={onClose} className={classes.overlay}></div>
      <div className={classes.modal}>
        <div className={classes.mainContent}>
          {children}

          <div className={classes.options}>
            <a href={image} download={true}>
              <Button>{icons.download}</Button>
            </a>

            <Button onClick={onClose}>{icons.remove}</Button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default ImageModal;
