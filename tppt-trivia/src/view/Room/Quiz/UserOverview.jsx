import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { getUserQuiz } from "../../../services/QuizService/Quizzes";

export default function UserOverview() {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const quiz = location.state.quiz;
  const quizId = location.state.quizId;
  const answers = location.state.answers;
  const selectedAnswers = location.state.selectedAnswers;
  const quizQuestions = location.state.quizQuestions;
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
          <p>
            Right answers: {userQuizResults.rightAnswers} out of{" "}
            {userQuizResults.questionLength}
          </p>
          <p>
            Points: {userQuizResults.points} out of{" "}
            {userQuizResults.totalPoints}
          </p>
        </div>
      )}
      {answers && (
        <div>
          <h2>Your answers:</h2>
          {answers.map((answer, index) => {
            const question = quizQuestions[index];
            const selectedAnswer = selectedAnswers[index];
            const isCorrect = selectedAnswer.split("-")[1] === "true";
            return (
              <div key={index}>
                <p>Question: {question.question}</p>
                <p style={{ color: isCorrect ? "green" : "red" }}>
                  Answer: {answer[index].text} {isCorrect ? "✅" : "❌"}
                </p>
                {isCorrect ? null : (
                  <p>Right answer is: {answer.find((a) => a.isCorrect).text}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}