import { get, onValue, query, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

export const takeAllQuizzes = async () => {
    const snapshot = await get(
        query(ref(db, 'quizes'))
    );

    if(!snapshot.exists()) {
        return [];
    }

    const quizzes = Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
    }));

    return quizzes;
}

export const listenForQuizzesChange = (callback) => {
    const quizzesRef = ref(db, 'quizzes');
  
    const unsubscribe = onValue(quizzesRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
  
      const quizzes = Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));
  
      callback(quizzes);
    });
  
    return unsubscribe;
  };