import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteQuizById } from "../../../services/QuizService/Quizzes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
    <Box>
      {userData.role === "teacher" && <h1>User Quizzes</h1>}
      {userQuizzes && userQuizzes.map((quiz) => {
        if (quiz.username === userData.username) {
          console.log(quiz)
          return (
            <Box key={quiz.id}>
              <Typography variant="h5">Quiz Name: {quiz.title}</Typography>
              <h2>Quiz Name: {quiz.description}</h2>
              <p>Quiz Description: {quiz.description}</p>
              <p>Quiz creator: {quiz.username}</p>
              <button onClick={() => {editQuiz(quiz)}}>Edit quiz</button>
              <button onClick={() => {deleteQuiz(quiz)}}>Delete quiz</button>
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
}

UserQuizzes.propTypes = {
  quizList: PropTypes.array,
};
