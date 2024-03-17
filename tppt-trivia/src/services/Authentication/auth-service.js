import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase-config';

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  try{
    const log = signInWithEmailAndPassword(auth, email, password);
    return log;
  }catch(error){
    console.error('Error logging in:', error);
  }
};

export const logoutUser = () => {
  return signOut(auth);
};