import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { changeQuizVisibility, updateQuizParticipants } from "../../../services/QuizService/Quizzes";
import { AppContext } from "../../../context/appContext";

export default function PublicRooms({ quizList }) {
  const { userData } = useContext(AppContext)
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [time, setTime] = useState({});

  useEffect(() => {
    setQuizzes(quizList.filter((quiz) => quiz.visibility === "public"));
  }, [quizList]);

  useEffect(() => {
    const interval = setInterval(() => {
      quizzes.forEach((quiz) => {
        const t = timeLeft(quiz);
        if(t.day === 0 && t.hour === 0 && t.minute === 0 && t.second === 0) {
          clearInterval(interval)
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
    quizzes.forEach((quiz) => {
      updateQuizParticipants(quiz.id,{...userData});
    });
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
    <div>
      <h1>Public Rooms</h1>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          return quiz.isActive === true ? (
            <div key={quiz.id}>
              <p>Quiz Title: {quiz.title}</p>
              <p>Quiz description: {quiz.description}</p>
              {time[quiz.id] && (
                <p>
                  Time left: {time[quiz.id].day} days {time[quiz.id].hour} hours{" "}
                  {time[quiz.id].minute} minutes {time[quiz.id].second} seconds
                </p>
              )}
              <button
                onClick={() => {
                  joinQuiz(quiz.id);
                }}
              >
                Join Quiz
              </button>
            </div>
          ) : (
            <div key={quiz.id}>
              <p>Quiz Title: {quiz.title}</p>
              <p>Quiz description: {quiz.description}</p>

              <button
                disabled={true}
                onClick={() => {
                  joinQuiz(quiz.id);
                }}
              >
                Join Quiz
              </button>
            </div>
          );
        })
      ) : (
        <p>No quizzes available</p>
      )}
    </div>
  );
}

PublicRooms.propTypes = {
  quizList: PropTypes.array,
};
