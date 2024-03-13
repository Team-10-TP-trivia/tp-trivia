import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { getUserQuiz } from "../../../services/QuizService/Quizzes";

export default function UserOverview() {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const quiz = location.state.quiz;
  const quizId = location.state.quizId;
  const [userQuizResults, setUserQuizResults] = useState([]);

  useEffect(() => {
    if (!quizId || !userData) return;
    const fetchUserResults = async () => {
      try {
        const snapshot = await getUserQuiz(userData.username, quizId);
        setUserQuizResults(snapshot);
      } catch (error) {
        console.error("Error fetching user results:", error);
      }
    };

    fetchUserResults();
  }, [userData, quizId]);

  return (
    <div>
      <h1>Your results for quiz {quiz.title}</h1>
      {userQuizResults && (
        <div>
          <p>Right answers: {userQuizResults.rightAnswers} out of {userQuizResults.questionLength}</p>
          <p>Points: {userQuizResults.points} out of {userQuizResults.totalPoints}</p>
        </div>
      )}
    </div>
  );
}
