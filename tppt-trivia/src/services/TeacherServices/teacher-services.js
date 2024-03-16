import { get, ref, set } from "firebase/database";
import { getAllUsers } from "../AdminServices/admin-services";
import { db } from "../../config/firebase-config";

export const findStudents = async (search) => {
  const users = await getAllUsers();
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
