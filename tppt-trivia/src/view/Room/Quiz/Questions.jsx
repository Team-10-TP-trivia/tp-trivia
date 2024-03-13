import { useState } from "react";
import PropTypes from "prop-types";
import "./Questions.css";

export default function Questions({
  quizQuestions,
  answers,
  selectedAnswers,
  setSelectedAnswers,
}) {
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(
    Array.from(quizQuestions.length).fill(false)
  );
  const [selectedAnswerId, setSelectedAnswerId] = useState(
    Array(quizQuestions.length).fill(-1)
  );

  const handleAnswerChange = (e) => {
    const newAnswersId = [...selectedAnswerId];
    newAnswersId[visibleQuestionIndex] = +e.target.id;
    setSelectedAnswerId(newAnswersId);
    const newAnswers = [...selectedAnswers];
    newAnswers[visibleQuestionIndex] = e.target.value;
    setSelectedAnswers(newAnswers);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[visibleQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    const nextIndex = visibleQuestionIndex + 1;
    const newIndex = nextIndex >= quizQuestions.length ? 0 : nextIndex;
    setVisibleQuestionIndex(newIndex);
    setSelectedAnswerId((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      if (newAnswers[visibleQuestionIndex] === "") {
        newAnswers[visibleQuestionIndex] = "";
      }
      return newAnswers;
    });
  };

  const handlePreviousQuestion = () => {
    const nextIndex = visibleQuestionIndex - 1;
    const newIndex = nextIndex < 0 ? quizQuestions.length - 1 : nextIndex;
    setVisibleQuestionIndex(newIndex);
    setSelectedAnswerId((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      if (newAnswers[visibleQuestionIndex] === "") {
        newAnswers[visibleQuestionIndex] = "";
      }
      return newAnswers;
    });
  };

  return (
    <div>
      {quizQuestions.map((question, index) => (
        <div key={question.id}>
          <button
            onClick={() => setVisibleQuestionIndex(index)}
            className={answeredQuestions[index] ? "answered" : "not-answered"}
          >
            {index + 1}
          </button>
        </div>
      ))}
      {visibleQuestionIndex !== null && (
        <div>
          <p>
            Question {visibleQuestionIndex + 1}:{" "}
            {quizQuestions[visibleQuestionIndex].question}
          </p>
          <p>Points: {quizQuestions[visibleQuestionIndex].points}</p>
          {quizQuestions[visibleQuestionIndex].image && (
            <img
              src={quizQuestions[visibleQuestionIndex].image}
              alt="question"
            />
          )}
          {answers[visibleQuestionIndex].map((ans) => {
            return (
              <div key={ans.id}>
                <input
                  type="radio"
                  id={ans.id}
                  name={quizQuestions[visibleQuestionIndex].id}
                  value={ans.text + "-" + ans.isCorrect.toString() + "-" + quizQuestions[visibleQuestionIndex].points}
                  checked={selectedAnswerId[visibleQuestionIndex] === ans.id}
                  onChange={handleAnswerChange}
                />
                <label htmlFor={ans.id}>{ans.text}</label>
                <p>{ans.points}</p>
              </div>
            );
          })}
          {quizQuestions.length > 1 && (
            <button onClick={handlePreviousQuestion}>Previous Question</button>
          )}
          {quizQuestions.length > 1 && (
            <button onClick={handleNextQuestion}>Next Question</button>
          )}
        </div>
      )}
    </div>
  );
}

Questions.propTypes = {
  quizQuestions: PropTypes.array,
  answers: PropTypes.array,
  selectedAnswers: PropTypes.array,
  setSelectedAnswers: PropTypes.func,
};
