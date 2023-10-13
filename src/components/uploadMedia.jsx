import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

const uploadMedia = async function (
  file,
  storageRef,
  actionWithTheLink,
  actionParams
) {
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  uploadTask.on(
    "state_changed",
    (snaps) => {
      const bytes = (snaps.bytesTransferred / snaps.totalBytes) * 100;
      console.log(bytes);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        // actionWithTheLink is requier function and actionParams ar arguments
        // we have to user download url as last params
        if (!actionParams) {
          actionWithTheLink(downloadUrl);
        }
        if (actionParams) {
          actionWithTheLink(...actionParams, downloadUrl);
        }
      });
    }
  );
};

export default uploadMedia;
