import { getDatabase, ref, update, push, child } from "firebase/database";
import { getStorage, ref as imageRef } from "firebase/storage";
import uploadMedia from "../Feature/uploadMedia";

export const updatePhoto = async function (file, userId, requireFunction) {
  const storage = getStorage();
  const db = getDatabase();

  const newKey = push(child(ref(db), "friends/")).key;

  const profileRef = imageRef(storage, `image/profile/${userId}/${newKey}`);

  uploadMedia(file, profileRef, requireFunction);
};

export const updateName = async function (userId, theName) {
  const db = getDatabase();
  const updates = {};
  updates[`users/${userId}/userName`] = theName;
  return update(ref(db), updates);
};
