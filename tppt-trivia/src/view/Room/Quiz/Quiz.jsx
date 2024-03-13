import { useContext, useEffect, useState } from "react";
import { getQuizById, takenQuiz } from "../../../services/QuizService/Quizzes";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Questions from "./Questions";
import { AppContext } from "../../../context/appContext"
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const { userData } = useContext(AppContext);
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [participants, setParticipants] = useState(null);
  const [time, setTime] = useState({});
  //const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quizQuestions.length).fill(-1)
  );
  const navigate = useNavigate()

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const snapshot = await getQuizById(quizId);
        setQuiz(snapshot);
        setQuizQuestions(snapshot.questions);
        setAnswers(
          snapshot.questions.map((questionId) => {
            return Object.values(questionId.answers);
          })
        );
        setParticipants(snapshot.participants);

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

  // useEffect(() => {
  //   if (quiz) {
  //     const interval = setInterval(() => {
  //       setTime((prevTime) => {
  //         const newTime = { ...prevTime };
  //         if (newTime.second === 0) {
  //           newTime.minute -= 1;
  //           newTime.second = 59;
  //         } else {
  //           newTime.second -= 1;
  //         }
  //         if (newTime.minute === 0 && newTime.second === 0) {
  //           clearInterval(interval);
  //           // To show overview - right answers from user and score
  //         }
  //         return newTime;
  //       });
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [quiz]);

  const saveAnswers = () => {
    let rightAnswers = 0;
    let wrongAnswers = 0;
    selectedAnswers.map((selAns) => {
      if (selAns.split("-").includes("true")) {
        rightAnswers++;
      }else if(selAns.split("-").includes("false")){
        wrongAnswers++;
      }
    });
    takenQuiz(userData.username, quizId, quizQuestions.length, rightAnswers, wrongAnswers)
    navigate(`${userData.username}/overview/`, { state: { quiz , quizId} })
  };

  return (
    <div>
      {quiz ? (
        <div>
          <h1>Quiz Title: {quiz.title}</h1>
          <h2>Quiz description: {quiz.description}</h2>
          <h2>
            Time left: {time.minute < 10 ? "0" : ""}
            {time.minute}:{time.second < 10 ? "0" : ""}
            {time.second}
          </h2>
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
          <p>
            Participants: {participants ? Object.keys(participants).length : 0}
          </p>
          <button onClick={() => saveAnswers()}>Save answers</button>
        </div>
      ) : (
        <p>No quiz available</p>
      )}
    </div>
  );
}
