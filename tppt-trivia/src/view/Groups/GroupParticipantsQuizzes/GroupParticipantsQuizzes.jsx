import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { takeAllQuizzes } from "../../../services/QuizService/Quizzes";
import { useNavigate } from "react-router-dom";

export default function GroupParticipantsQuizzes() {
  const location = useLocation();
  const users = location.state.users;
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Object.values(users).map((user) => {
      takeAllQuizzes(null, user.uid).then((quizzes) => {
        setQuizzes(quizzes);
      });
    });
  }, [users]);

  const editQuiz = (quiz) => {
    navigate(`/edit-quiz/${quiz.id}`, {state: {quiz}});
  };

  return (
    <div>
      <h1>Quizzes created by group participants:</h1>
      {Object.values(quizzes).map((quiz) => {
        return (
        <div key={quiz.id}>
            <h3>Quiz title: {quiz.title}</h3>
            <p>Category: {quiz.category}</p>
            <p>Created on: {quiz.createdOn}</p>
            <p>Time limit: {quiz.timeLimit}</p>
            <button onClick={() => editQuiz(quiz)}>Edit quiz</button>
        </div>
        )
      })}
    </div>
  );
}
