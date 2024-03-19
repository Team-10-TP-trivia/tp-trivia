import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { takeAllQuizzesByGroupUsers } from "../../../services/QuizService/Quizzes";
import { useNavigate } from "react-router-dom";

export default function GroupParticipantsQuizzes() {
  const location = useLocation();
  const users = location.state.users;
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [ filteredQuizzes, setFilteredQuizzes ] = useState([]);

  useEffect(() => {
    takeAllQuizzesByGroupUsers().then((quizzes) => {
      setQuizzes(quizzes)
    });
  }, [users]);

  useEffect(() => {
    if (!users || !quizzes.length) return;
  
    const filteredQuizzes = Object.values(users).flatMap((user) =>
      quizzes.filter((quiz) => quiz.creatorId === user.uid)
    );
  
    setFilteredQuizzes(filteredQuizzes);
  }, [quizzes, users]);
  

  const editQuiz = (quiz) => {
    navigate(`/edit-quiz/${quiz.id}`, { state: { quiz } });
  };

  //console.log(filteredQuizzes)

  return (
    <div>
      <h1>Quizzes created by group participants:</h1>
      {Object.values(filteredQuizzes).map((quiz) => {
        return (
          <div key={quiz.id}>
            <h3>Quiz title: {quiz.title}</h3>
            <p>Category: {quiz.category}</p>
            <p>Created on: {quiz.createdOn}</p>
            <p>Time limit: {quiz.timeLimit}</p>
            <p>Time limit: {quiz.username}</p>
            <button onClick={() => editQuiz(quiz)}>Edit quiz</button>
          </div>
        );
      })}
    </div>
  );
}
