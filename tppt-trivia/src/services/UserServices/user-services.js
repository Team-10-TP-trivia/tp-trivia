import { get, set, ref, query, equalTo, orderByChild, onValue } from 'firebase/database';
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

export const getUsers = (setUsers, searchKeyword) => {
  const usersRef = ref(db, 'users');

  const callback = (snapshot) => {
    if(snapshot.exists()) {
      let users = snapshot.val();

      if(searchKeyword) {
        users = Object.values(users).filter(user => user.username.includes(searchKeyword.toLowerCase()) || user.firstName.includes(searchKeyword.toLowerCase()) || user.lastName.includes(searchKeyword.toLowerCase()));
      }

      setUsers(users);
    } else{
      console.log("No data available");
    }
  }

  onValue(usersRef, callback);

  return () => {
    onValue(usersRef, callback);
  }
}
