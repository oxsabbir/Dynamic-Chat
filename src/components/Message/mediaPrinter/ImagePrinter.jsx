import { useState } from "react";
import classes from "../Message.module.css";
import makeDate from "../../Feature/makeDate";
import ImageModal from "../../UI/Modal/imageModal";

const ImagePrinter = function ({ item, authUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const [isShown, setIsShown] = useState(false);

  const dateShowHanlder = function () {
    setIsShown((prev) => !prev);
  };

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
          onClick={dateShowHanlder}
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
            <div
              className={`${
                item.from === authUser ? classes.authTextMsg : classes.textMsg
              } ${classes.textFull}`}
            >
              <div>
                <p>{item.message}</p>
                <p
                  className={`${isShown ? classes.dateShow : classes.dateTime}`}
                >
                  {makeDate(item.time)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ImagePrinter;
