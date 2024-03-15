import { get, set, ref, query, equalTo, orderByChild, onValue } from 'firebase/database';
import { db } from '../../config/firebase-config';


export const getUserByHandle = (username, callback) => {
  const userRef = ref(db, `users/${username}`);
  onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    callback(userData);
  });
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
