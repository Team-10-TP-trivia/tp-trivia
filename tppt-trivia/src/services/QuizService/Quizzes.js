import { get, query, ref, set, update } from "firebase/database";
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
export const updateQuizParticipants = (quizId, user) => {
  return set(ref(db, `quizes/${quizId}/participants/${user.username}`), {
    ...user,
  });
}
export const deleteQuizById = (quizId) => {
  const updateQuiz = {};
  updateQuiz[`/quizes/${quizId}`] = null;
  return update(ref(db), updateQuiz);
}

export const getQuizById = async(quizId) => {
  const snapshot = await get(query(ref(db, `quizes/${quizId}`)));

  if (!snapshot.exists()) {
    return [];
  }

  return snapshot.val();
}

export const changeQuizVisibility = (quizId) => {
  const updateQuiz = {};
  updateQuiz[`/quizes/${quizId}/isActive`] = false;
  return update(ref(db), updateQuiz);
}