import { get, ref, set } from "firebase/database";
import { db } from "../../config/firebase-config";

const allStudents = async () => {
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


export const findStudents = async (search) => {
  const users = await allStudents();
  const searchTerms = search.toLowerCase().split(" ");
  return users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      user.role === "student" &&
      searchTerms.every((term) => fullName.includes(term))
    );
  });
};

export const sendQuizInvitation = async (studentName, quiz, quizId) => {
  return set(ref(db, `users/${studentName}/quizInvitations/${quizId}`), {
    ...quiz,
    quizId,
    seen: false,
  });
};

export const userAcceptedQuiz = async (studentName, quizId) => {
    const quizRef = ref(db, `users/${studentName}/quizInvitations/${quizId}`);
    const snapshot = await get(quizRef);
    const quiz = snapshot.val();
    if (quiz) {
        quiz.seen = true;
        return set(quizRef, quiz);
    }
};
