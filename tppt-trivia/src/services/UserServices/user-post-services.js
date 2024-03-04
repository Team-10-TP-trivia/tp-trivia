import {
  get,
  onValue,
  //get,
  //set,
  ref,
  update,
  //query,
  //equalTo,
  //orderByChild
} from "firebase/database";
import { db, storage } from "../../config/firebase-config";
import { getDownloadURL, ref as sRef, uploadBytes } from "firebase/storage";

export const updateSentRequest = async (username) => {
  const updateTeacherRef = {};
  updateTeacherRef[`users/${username}/pendingVerification`] = true;
  return update(ref(db), updateTeacherRef);
};

export const isTeacherApproveChange = async (teacherUsername) => {
  onValue(ref(db, `users/${teacherUsername}`), (snapshot) => {
    return snapshot.val();
  });
};

export const uploadProfilePicture = async (userId, file) => {
  if (!file) return;
  const storageRef = sRef(storage, `users/${userId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const updateUserDetails = async (username, userInfo) => {
  const userRef = ref(db, `users/${username}`);
  await update(userRef, userInfo);
};

export const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(db, "users"));
    if (!snapshot.exists()) {
      return [];
    }
    const users = Object.keys(snapshot.val()).map((key) => ({
      id: key,
      ...snapshot.val()[key],
    }));
    return users;
  }
  catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
