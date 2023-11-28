import { useState } from "react";
import classes from "../Message.module.css";

import ImageModal from "../../UI/Modal/imageModal";

const ImagePrinter = function ({ item, authUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = function () {
    setIsOpen(false);
  };
  const openModal = function () {
    setIsOpen(true);
  };

  return (
    <>
      {item.image && (
        <div
          className={`${
            item.from === authUser
              ? classes.imageFileAuth
              : classes.imageFileOther
          } ${classes.imageFile}`}
        >
          <ImageModal onClose={closeModal} isOpen={isOpen} image={item.image}>
            <img src={item.image} loading="lazy" />
          </ImageModal>
          <div onClick={openModal}>
            <img src={item.image} loading="lazy" />
          </div>

          {item.message && (
            <p
              className={`${
                item.from === authUser ? classes.authTextMsg : classes.textMsg
              } ${classes.textFull}`}
            >
              {item.message}
            </p>
          )}
        </div>
      )}
    </>
  );
};
export default ImagePrinter;
