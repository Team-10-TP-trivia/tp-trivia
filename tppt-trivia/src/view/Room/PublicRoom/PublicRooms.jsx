import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  changeQuizVisibility,
  updateQuizParticipants,
} from "../../../services/QuizService/Quizzes";
import { AppContext } from "../../../context/appContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PublicRooms({ quizList }) {
  const { userData } = useContext(AppContext);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [time, setTime] = useState({});

  useEffect(() => {
    const publicQuizzesWithAmericanDateFormat = quizList
    .filter((quiz) => quiz.visibility === "public")
    .map((quiz) => {
      let date = quiz.createdOn;
      date = date.replace(' г.', '');
      let parts = date.split(".");
      let formattedDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      let formattedDate = new Date(formattedDateStr);
      return {
        ...quiz,
        createdOn: formattedDate,
      };
    });
    const sortedQuizzes = publicQuizzesWithAmericanDateFormat.sort((a, b) => {
      return b.createdOn - a.createdOn;
    });
    setQuizzes(sortedQuizzes);
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

  const joinQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
    if (userData.role === "student") {
      quizzes.forEach((quiz) => {
        updateQuizParticipants(quiz.id, { ...userData });
      });
    }
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
    <Box display={"flex"} sx={{
      flexDirection: "column",
        width: "35%",
    }}
    gap={"20px"}>
      <Typography variant="h4">Public Quizzes</Typography>
      {userData.role === "student" && quizzes.length > 0 && (
        <Box display={"flex"} gap={"20px"}>
          {quizzes.map((quiz) => {
            return quiz.isActive === true ? (
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
                  <Typography variant="h5">
                    Time left: {time[quiz.id].day} days {time[quiz.id].hour}{" "}
                    hours {time[quiz.id].minute} minutes {time[quiz.id].second}{" "}
                    seconds
                  </Typography>
                )}
                <button
                  onClick={() => {
                    joinQuiz(quiz.id);
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
                <button
                  disabled={true}
                  onClick={() => {
                    joinQuiz(quiz.id);
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
        <Box display={"flex"} sx={{
          flexDirection: "column",
        }}>
          {quizzes.map((quiz) => {
            return (
              <Box
                key={quiz.id}
                sx={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "10px",
                  marginLeft: "10px",
                  maxWidth: "50vw",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h6">Quiz Title: {quiz.title}</Typography>
                <Typography variant="h6">
                  Quiz description: {quiz.description}
                </Typography>
                <Typography variant="h6">
                  Created on: {quiz.createdOn.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}
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
                    joinQuiz(quiz.id);
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

PublicRooms.propTypes = {
  quizList: PropTypes.array,
};
