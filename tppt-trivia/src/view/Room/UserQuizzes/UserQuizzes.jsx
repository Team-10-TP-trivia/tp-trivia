import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteQuizById } from "../../../services/QuizService/Quizzes";

export default function UserQuizzes({ quizList }) {
  const { userData } = useContext(AppContext);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData || !userData.uid) return;
    setUserQuizzes(quizList.filter((quiz) => quiz.creatorId === userData.uid));
  }, [userData, quizList]);

  const editQuiz = (quiz) => {
    navigate(`/edit-quiz/${quiz.id}`, {state: {quiz}});
  }
  const deleteQuiz = (quiz) => {
    deleteQuizById(quiz.id);
  }
  if(!userData) return (<p>Loading...</p>);
  
  return (
    <div>
      {userData.role === "teacher" && <h1>User Quizzes</h1>}
      {userQuizzes && userQuizzes.map((quiz) => {
        if (quiz.username === userData.username) {
          return (
            <div key={quiz.id}>
              <h2>Quiz Name: {quiz.description}</h2>
              <p>Quiz Description: {quiz.description}</p>
              <p>Quiz creator: {quiz.username}</p>
              <button onClick={() => {editQuiz(quiz)}}>Edit quiz</button>
              <button onClick={() => {deleteQuiz(quiz)}}>Delete quiz</button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

UserQuizzes.propTypes = {
  quizList: PropTypes.array,
};
