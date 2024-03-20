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
    navigate(`/edit-quiz/${quiz.id}`, { state: { quiz } });
  };
  const deleteQuiz = (quiz) => {
    deleteQuizById(quiz.id);
  };
  if (!userData) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "500px",
      }}
    >
      {userData.role === "teacher" && <Typography variant="h4">{userData.username[0].toUpperCase() + userData.username.slice(1)} Quizzes</Typography>}
      {userQuizzes &&
        userQuizzes.map((quiz) => {
          if (quiz.username === userData.username) {
            return (
              <Box
                key={quiz.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "400px",
                  border: "1px solid black",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h6">Quiz Name: {quiz.title}</Typography>
                <Typography variant="h6">
                  Quiz Name: {quiz.description}
                </Typography>
                <Typography variant="h6">
                  Questions: {quiz.visibility}
                </Typography>
                {quiz.visibility === "private" && (
                  <Typography variant="h6">
                    Quiz code: {quiz.privateCode}
                  </Typography>
                )}
                <Box>
                  <button
                    onClick={() => {
                      editQuiz(quiz);
                    }}
                  >
                    Edit quiz
                  </button>
                  <button
                    onClick={() => {
                      deleteQuiz(quiz);
                    }}
                  >
                    Delete quiz
                  </button>
                </Box>
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
