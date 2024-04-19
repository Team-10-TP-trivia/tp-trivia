import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { deleteQuizById } from "../../../services/QuizService/Quizzes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function UserQuizzes() {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const quizList = location.state.quizzes;
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

  if (!userData || !quizList) {
    return <p>Loading...</p>;
  }

  return (
    <Box
      display={"flex"}
      sx={{
        flexDirection: "column",
        width: "100%",
        minHeight: "400px",
        height: "fit-content",
      }}
      gap={"20px"}
    >
      {userData.role === "teacher" && (
        <Typography variant="h4">
          {userData.username[0].toUpperCase() + userData.username.slice(1)}{" "}
          Quizzes
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          gap: "20px",
        }}
      >
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
                  <Typography
                    variant="h6"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "18px",
                    }}
                  >
                    Quiz Title: {quiz.title}
                  </Typography>
                  <Typography variant="h6">
                    Questions: {quiz.questions.length}
                  </Typography>
                  <Typography variant="h6">
                    Visibility: {quiz.visibility}
                  </Typography>
                  {quiz.visibility === "private" ? (
                    <Typography variant="h6">
                      Quiz code: {quiz.privateCode}
                    </Typography>
                  ) : (
                    <Typography variant="h6">
                      <br />
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
    </Box>
  );
}

UserQuizzes.propTypes = {
  quizList: PropTypes.array,
};
