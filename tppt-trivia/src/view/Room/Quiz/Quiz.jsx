import { useContext, useEffect, useState } from "react";
import { getQuizById, takenQuiz } from "../../../services/QuizService/Quizzes";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Questions from "./Questions";
import { AppContext } from "../../../context/appContext";
import { useNavigate } from "react-router-dom";
import TeacherOverview from "./TeacherOverview";
import "./Quiz.css";

export default function Quiz() {
  const { userData } = useContext(AppContext);
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [participants, setParticipants] = useState(null);
  const [time, setTime] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quizQuestions.length).fill(-1)
  );
  const navigate = useNavigate();
  const [showUnansweredPopup, setShowUnansweredPopup] = useState(false);
  const [quizPoints, setQuizPoints] = useState(0);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const snapshot = await getQuizById(quizId);
        setQuiz(snapshot);
        if (!snapshot.questions) return;
        setQuizQuestions(snapshot.questions);
        setQuizPoints(
          snapshot.questions.reduce((acc, curr) => acc + curr.points, 0)
        );
        setAnswers(
          snapshot.questions.map((questionId) => {
            return Object.values(questionId.answers);
          })
        );
        if (snapshot.participants) setParticipants(snapshot.participants);

        // Calculate initial time left once quiz data is fetched
        const minutesLeft = parseFloat(snapshot.timeLimit.split(" ")[0]);
        const targetDate = new Date();
        targetDate.setMinutes(targetDate.getMinutes() + minutesLeft);
        const differenceMs = targetDate - new Date();
        const minutes = Math.floor(differenceMs / (1000 * 60));
        const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);
        setTime({ minute: minutes, second: seconds });
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = { ...prevTime };
          if (newTime.second === 0) {
            newTime.minute -= 1;
            newTime.second = 59;
          } else {
            newTime.second -= 1;
          }
          if (newTime.minute === 0 && newTime.second === 0) {
            clearInterval(interval);
            // To show overview - right answers from user and score
            navigate(`${userData.username}/overview/`, {
              state: { quiz, quizId },
            });
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quiz, userData, navigate, quizId, quizQuestions.length]);

  const saveAnswers = () => {
    let rightAnswers = 0;
    let wrongAnswers = 0;
    let userPoints = 0;
    selectedAnswers.map((selAns) => {
      if (selAns !== undefined) {
        const splitAns = selAns.split("-");
        if (splitAns.includes("true")) {
          userPoints += +splitAns[2];
          rightAnswers++;
        } else if (splitAns.includes("false")) {
          wrongAnswers++;
        }
      }
    });

    takenQuiz(
      userData.username,
      quizId,
      quizQuestions.length,
      rightAnswers,
      wrongAnswers,
      quizPoints,
      userPoints
    );
    if (selectedAnswers.length < quizQuestions.length) {
      setShowUnansweredPopup(true);
    } else {
      moveToNextPage();
    }
  };

  const moveToNextPage = () => {
    navigate(`${userData.username}/overview/`, {
      state: { quiz, quizId, answers, selectedAnswers, quizQuestions },
    });
  };

  if (!userData || !quiz) return null;

  return (
    <>
      {userData.role === "student" && quiz && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            width: "75%",
          }}>
            <div>
              <h1>Quiz Title: {quiz.title}</h1>
              <h2>Quiz description: {quiz.description}</h2>
            </div>
            <h2>
              Time left: {time.minute < 10 ? "0" : ""}
              {time.minute}:{time.second < 10 ? "0" : ""}
              {time.second}
            </h2>
          </div>
          <Questions
            quizQuestions={quizQuestions}
            answers={answers}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
          />
          {participants &&
            Object.values(participants).map((participant) => {
              if (participant.active === true) {
                return (
                  <div key={participant.uid}>
                    <Avatar
                      src={participant.photoURL}
                      alt={participant.username}
                    />
                    <p>Participant: {participant.username}</p>
                    <p>Score: {participant.score}</p>
                  </div>
                );
              }
            })}
          {showUnansweredPopup && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <p>You have unanswered questions. Do you want to proceed?</p>
              <button className="save-proceed-cancel-buttons" onClick={() => setShowUnansweredPopup(false)}>
                Cancel
              </button>
              <button className="save-proceed-cancel-buttons" onClick={() => moveToNextPage()}>Proceed</button>
            </div>
          )}
          <button className="save-proceed-cancel-buttons" onClick={() => saveAnswers()}>Save answers</button>
        </div>
      )}
      {userData.role === "teacher" && quiz && (
        <TeacherOverview
          quiz={quiz}
          quizId={quizId}
          participants={participants}
        />
      )}
    </>
  );
}
