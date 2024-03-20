import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { changeQuizVisibility } from "../../../services/QuizService/Quizzes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PrivateRooms({ quizList }) {
  const { userData } = useContext(AppContext);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [time, setTime] = useState({});

  useEffect(() => {
    setQuizzes(quizList.filter((quiz) => quiz.visibility === "private"));
  }, [quizList]);

  useEffect(() => {
    const interval = setInterval(() => {
      quizzes.forEach((quiz) => {
        const t = timeLeft(quiz);
        if (t.day === 0 && t.hour === 0 && t.minute === 0 && t.second === 0) {
          clearInterval(interval);
          changeQuizVisibility(quiz.id);
        }
        setTime((prevTime) => ({
          ...prevTime,
          [quiz.id]: t,
        }));
      });
    }, 0);

    return () => clearInterval(interval);
  }, [quizzes]);

  const joinPrivateQuizStudent = (quizId) => {
    navigate(`/quiz/${quizId}/enter-code`, {
      state: { quizId, userData, quizzes },
    });
  };

  const joinPrivateQuizTeacher = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const timeLeft = (quiz) => {
    const [day, month, year] = quiz.activeState.split(" ")[0].split(".");
    const formattedDateStr = `${month}/${day}/${year}`;
    const targetDate = new Date(formattedDateStr);
    targetDate.setHours(23, 59, 59, 999);

    const differenceMs = targetDate - new Date();

    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);
    return {
      day: days,
      hour: hours,
      minute: minutes,
      second: seconds,
    };
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={"20px"} sx={{
      width: "33%",
    }}>
      <Typography variant="h4">Private Quizzes</Typography>
      {userData.role === "student" && quizzes.length > 0 && (
        <Box display={"flex"} gap={"20px"} >
          {quizzes.map((quiz) => {
            return quiz.isActive === true ? (
              <Box
                key={quiz.id}
                sx={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "10px",
                  marginLeft: "10px",
                  maxWidth: "500px",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h6">Quiz Title: {quiz.title}</Typography>
                <Typography variant="h6">
                  Quiz description: {quiz.description}
                </Typography>
                <Typography variant="h6">
                  Questions: {quiz.questions.length}
                </Typography>
                {time[quiz.id] && (
                  <Typography variant="h5">
                    Time left: {time[quiz.id].day} days {time[quiz.id].hour}{" "}
                    hours {time[quiz.id].minute} minutes {time[quiz.id].second}{" "}
                    seconds
                  </Typography>
                )}
                <button
                  onClick={() => {
                    joinPrivateQuizStudent(quiz.id);
                  }}
                >
                  Join Quiz
                </button>
              </Box>
            ) : (
              <Box key={quiz.id} display={"flex"}>
                <Typography variant="h6">Quiz Title: {quiz.title}</Typography>
                <Typography variant="h6">
                  Quiz description: {quiz.description}
                </Typography>
                <Typography variant="h6">
                  Questions: {quiz.questions.length}
                </Typography>
                <Typography variant="h6">
                  Questions: {quiz.questions.length}
                </Typography>
                <button
                  disabled={true}
                  onClick={() => {
                    joinPrivateQuizStudent(quiz.id);
                  }}
                >
                  Join Quiz
                </button>
              </Box>
            );
          })}
        </Box>
      )}
      {userData.role === "teacher" && quizzes.length > 0 && (
        <Box display={"flex"} flexDirection={"column"}>
          {quizzes.map((quiz) => {
            return (
              <Box
                key={quiz.id}
                sx={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "10px",
                  marginLeft: "10px",
                  minWidth: "300px",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h6">Quiz Title: {quiz.title}</Typography>
                <Typography variant="h6">
                  Quiz description: {quiz.description}
                </Typography>
                <Typography variant="h6">
                  Questions: {quiz.questions.length}
                </Typography>
                {time[quiz.id] && (
                  <Typography variant="h6">
                    Time left: {time[quiz.id].day} days {time[quiz.id].hour}{" "}
                    hours {time[quiz.id].minute} minutes {time[quiz.id].second}{" "}
                    seconds
                  </Typography>
                )}
                <button
                  onClick={() => {
                    joinPrivateQuizTeacher(quiz.id);
                  }}
                >
                  See Quiz
                </button>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
PrivateRooms.propTypes = {
  quizList: PropTypes.array,
};
