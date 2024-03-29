import { get, query, ref, set, update } from "firebase/database";
import { db } from "../../config/firebase-config";

export const takeAllQuizzes = async (search, userId) => {
  const snapshot = await get(query(ref(db, "quizes")));

  if (!snapshot.exists()) {
    return [];
  }

  const quizzes = Object.keys(snapshot.val()).map((key) => ({
    id: key,
    ...snapshot.val()[key],
  }));

  if (search) {
    const filteredQuizzes = quizzes.filter((quiz) => {
      const { title, category } = quiz;
      return title.includes(search) || category.includes(search);
    });
    return filteredQuizzes;
  }
  if (userId) {
    const userQuizzes = quizzes.filter((quiz) => quiz.creatorId === userId);
    return userQuizzes;
  }

  return quizzes;
};

export const takeAllQuizzesByGroupUsers = async () => {
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
};
export const updateQuizParticipants = (quizId, user) => {
  return set(ref(db, `quizes/${quizId}/participants/${user.username}`), {
    ...user,
  });
};
export const deleteQuizById = (quizId) => {
  const updateQuiz = {};
  updateQuiz[`/quizes/${quizId}`] = null;
  return update(ref(db), updateQuiz);
};

export const getQuizById = async (quizId) => {
  const snapshot = await get(query(ref(db, `quizes/${quizId}`)));

  if (!snapshot.exists()) {
    return [];
  }

  return snapshot.val();
};

export const changeQuizVisibility = (quizId) => {
  const updateQuiz = {};
  updateQuiz[`/quizes/${quizId}/isActive`] = false;
  return update(ref(db), updateQuiz);
};

export const takenQuiz = (
  username,
  quizId,
  questionLength,
  rightAnswers,
  wrongAnswers,
  quizPoints,
  receivedPoints
) => {
  return set(ref(db, `/users/${username}/takenQuizzes/${quizId}`), {
    questionLength,
    quizPoints,
    receivedPoints,
    rightAnswers,
    wrongAnswers,
  });
};

export const getUserQuiz = async (username, quizId) => {
  const snapshot = await get(
    query(ref(db, `/users/${username}/takenQuizzes/${quizId}`))
  );

  if (!snapshot.exists()) {
    return [];
  }

  return snapshot.val();
};

export const userRejectQuiz = (username, quiz) => {
  const updateQuiz = {};
  updateQuiz[`/users/${username}/quizInvitations/${quiz.title}`] = null;
  return update(ref(db), updateQuiz);
};
