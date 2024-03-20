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
  updateTeacherRef[`users/${username}/pendingVerification`] = "pending";
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

export const uploadVerificationFile = async (userId, file) => {
  if (!file) return;
  const storageRef = sRef(storage, `verifications/${userId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
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

export const sendUserInvitation = async (username, group) => {
  const updateUserInvitations = {};
  updateUserInvitations[`users/${username}/groupInvitations/${group.groupId}`] = {
    groupId: group.groupIds,
    groupName: group.groupName,
    creator: group.creatorUsername,
    status: "pending",
  };

  await update(ref(db), updateUserInvitations);
};

export const userAcceptRequest = async (groupName, username, user) => {
  const userRef = get(ref(db, `users/${username}/groupInvitations/${groupName}`));
 
  const updateGroupUsers = {};
  updateGroupUsers[`groups/${groupName}/users/${username}`] = user;
  updateGroupUsers[`users/${username}/groupInvitations/${groupName}`] = {
    ...userRef,
    status: "accepted",
  };
  await update(ref(db), updateGroupUsers);
}

export const userRejectRequest = async (groupName, username) => {
  const updateGroupRequests = {};
  updateGroupRequests[`users/${username}/groupInvitations/${groupName}`] = null;
  await update(ref(db), updateGroupRequests);
}