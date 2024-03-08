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
  const [answeredQuestions, setAnsweredQuestions] = useState(new Array(quizQuestions.length).fill(false));

  const handleAnswerChange = (e) => {
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
    setSelectedAnswers((prevAnswers) => {
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
    setSelectedAnswers((prevAnswers) => {
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
          <button onClick={() => setVisibleQuestionIndex(index)}
          className={answeredQuestions[index] ? 'answered' : 'not-answered'}
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
          {quizQuestions[visibleQuestionIndex].image && (
            <img
              src={quizQuestions[visibleQuestionIndex].image}
              alt="question"
            />
          )}
          {answers[visibleQuestionIndex].map((ans) =>{
            return (
                <div key={ans.id}>
                  <input
                    type="radio"
                    id={ans.id}
                    name={quizQuestions[visibleQuestionIndex].id}
                    value={ans.text}
                    checked={selectedAnswers[visibleQuestionIndex] === ans.text}
                    onChange={handleAnswerChange}
                  />
                  <label htmlFor={ans.id}>{ans.text}</label>
                </div>
              )
          } )}
          <button onClick={handlePreviousQuestion}>Previous Question</button>
          <button onClick={handleNextQuestion}>Next Question</button>
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
