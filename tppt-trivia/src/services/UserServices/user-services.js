import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../../config/firebase-config';


export const getUserByHandle = (username) => {
  return get(ref(db, `users/${username}`))
};

export const createUserHandle = (username,firstName,lastName, uid, email, phoneNumber, role) => {

  return set(ref(db, `users/${username}`), { 
    username,
    firstName,
    lastName,
    uid, 
    email, 
    phoneNumber,
    role, 
    createdOn: new Date().valueOf(),
    isAdmin: false,
    verified : false,
    pendingVerification: "waiting",
    blocked: false,
  });
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getUsers = async () => {

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
}
