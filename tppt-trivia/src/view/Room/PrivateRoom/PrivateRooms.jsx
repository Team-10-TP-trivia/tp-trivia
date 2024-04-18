import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import { changeQuizVisibility } from "../../../services/QuizService/Quizzes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BsSend } from "react-icons/bs";

export default function PrivateRooms() {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const quizList = location.state.quizzes;
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [time, setTime] = useState({});

  useEffect(() => {
    const privateQuizzesWithAmericanDateFormat = quizList
      .filter((quiz) => quiz.visibility === "private")
      .map((quiz) => {
        let date = quiz.createdOn;
        date = date.replace(" г.", "");
        let parts = date.split(".");
        let formattedDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        let formattedDate = new Date(formattedDateStr);
        return {
          ...quiz,
          createdOn: formattedDate,
        };
      });
    const sortedQuizzes = privateQuizzesWithAmericanDateFormat.sort((a, b) => {
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

  if (!userData || !quizList) {
    return <p>Loading...</p>;
  }

  return (
    <Box
      display={"flex"}
      sx={{
        flexDirection: "column",
        width: "100%",
      }}
      gap={"20px"}
    >
      <Typography variant="h4">Public Quizzes</Typography>
      {userData.role === "student" && quizzes.length > 0 && (
        <Box display={"flex"} gap={"20px"}>
          {quizzes.map((quiz) => {
            return (
              quiz.isActive === false && (
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
                      hours {time[quiz.id].minute} minutes{" "}
                      {time[quiz.id].second} seconds
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
              )
            );
            // : (
            //   <Box key={quiz.id} display={"flex"}>
            //     <Typography variant="h6">Quiz Title: {quiz.title}</Typography>
            //     <Typography variant="h6">
            //       Quiz description: {quiz.description}
            //     </Typography>
            //     <Typography variant="h6">
            //       Questions: {quiz.questions.length}
            //     </Typography>
            //     <button
            //       disabled={true}
            //       onClick={() => {
            //         joinQuiz(quiz.id);
            //       }}
            //     >
            //       Join Quiz
            //     </button>
            //   </Box>
            // );
          })}
        </Box>
      )}
      {userData.role === "teacher" && quizzes.length > 0 && (
        <Box
          display={"flex"}
          sx={{
            marginTop: "20px",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "90px",
            justifyContent: "center",
          }}
        >
          {quizzes.map((quiz) => {
            return (
              <Box
                key={quiz.id}
                sx={{
                  position: "relative",
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "10px",
                  width: "200px",
                  minHeight: "100px",
                  ":hover": {
                    backgroundColor: "#d2f5bf",
                  },
                  "&:hover div": {
                    display: "block",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "none",
                    position: "absolute",
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid black",
                    bottom: "185px",
                    minHeight: "50px",
                    height: "fit-content",
                    width: "fit-content",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    {quiz.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    Created on:{" "}
                    {quiz.createdOn instanceof Date
                      ? quiz.createdOn.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    Questions: {quiz.questions.length}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "18px",
                  }}
                >
                  {quiz.title}
                </Typography>
                {time[quiz.id] && (
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    Time left: <br />
                    {time[quiz.id].day} days {time[quiz.id].hour} hours{" "}
                    {time[quiz.id].minute} minutes {time[quiz.id].second}{" "}
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
                <BsSend
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "10px",
                    fontSize: "25px",
                  }}
                  onClick={() => {
                    console.log("first");
                  }}
                />
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
