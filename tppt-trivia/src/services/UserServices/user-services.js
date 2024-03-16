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
    pendingVerification: false,
  });
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};
