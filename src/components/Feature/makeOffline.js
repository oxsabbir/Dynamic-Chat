import { getAuth } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
const makeOffline = async function () {
  const auth = getAuth();
  const db = getDatabase();
  const ups = {};
  ups[`users/${auth.currentUser.uid}/isActive/isActive`] = false;
  return update(ref(db), ups);
};
export default makeOffline;
