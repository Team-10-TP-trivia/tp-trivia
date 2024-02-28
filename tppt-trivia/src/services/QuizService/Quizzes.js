import { get, query, ref, update } from "firebase/database";
import { db } from "../../config/firebase-config";

export const takeAllQuizzes = async () => {
  const snapshot = await get(query(ref(db, "quizes")));

  if (!snapshot.exists()) {
    return [];
  }

  const quizzes = Object.keys(snapshot.val()).map((key) => ({
    id: key,
    ...snapshot.val()[key],
  }));

  return quizzes;
};

export const updateQuiz = (quizId, quizData) => {
  const updateQuiz = {};
  updateQuiz[`/quizes/${quizId}`] = quizData;
  return update(ref(db), updateQuiz);
}