import { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  getQuizById,
  updateQuizParticipants,
} from "../../../services/QuizService/Quizzes";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/appContext";

export const PrivateQuizPinCode = () => {
  const location = useLocation();
  const { userData } = useContext(AppContext);
  const quizzes = location.state.quizzes;
  const quizId = location.state.quizId;
  const [quiz, setQuiz] = useState(null);
  const [pinCode, setPinCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const snapshot = await getQuizById(quizId);
        setQuiz(snapshot);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handlePinCodeChange = (event, index) => {
    const { value } = event.target;
    setPinCode((prevPinCode) => {
      const newPinCode = [...prevPinCode];
      newPinCode[index] = value;

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }

      const enteredCode = newPinCode.join("");
      if (enteredCode.length === quiz.privateCode.length) {
        if (enteredCode === quiz.privateCode) {
          navigate(`/quiz/${quizId}`);
          if (userData.role === "student") {
            quizzes.forEach((quiz) => {
              updateQuizParticipants(quiz.id, { ...userData });
            });
          }
          setErrorMessage(""); 
        } else {
          setErrorMessage("Incorrect pin code");
          setPinCode('');
          inputRefs.current[0].focus();
        }
      } else {
        
        setErrorMessage("");
      }

      return newPinCode;
    });
  };

  if (!quiz || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Enter the private code to join quiz</h1>
      <div>
        {Array.from({ length: quiz.privateCode.length }, (_, index) => (
          <input
            key={index}
            type="text"
            value={pinCode[index] || ""}
            maxLength={1}
            onChange={(event) => handlePinCodeChange(event, index)}
            ref={(input) => (inputRefs.current[index] = input)}
          />
        ))}
      </div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};
