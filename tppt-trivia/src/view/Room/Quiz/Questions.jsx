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
    newAnswers[visibleQuestionIndex] = e.target.value.trim();
    setSelectedAnswers(newAnswers);
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[visibleQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    console.log(selectedAnswers);
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

  const getMediaUrl = (question) => {
    if (question.selectedGif) {
      return question.selectedGif;
    } else if (question.selectedUnsplash) {
      return question.selectedUnsplash;
    }
  };

  return (
    <div className="questions-container">
      <div className="question-buttons">
        {quizQuestions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => setVisibleQuestionIndex(index)}
            className={`${
              answeredQuestions[index] ? "answered" : "not-answered"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {visibleQuestionIndex !== null && (
        <div className="question-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <p style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}>
              Question {visibleQuestionIndex + 1}:{" "}
              {quizQuestions[visibleQuestionIndex].question}
            </p>
            <p style={{
              fontSize: "1.3rem",
            }}>Points: {quizQuestions[visibleQuestionIndex].points}</p>
          </div>
          {getMediaUrl(quizQuestions[visibleQuestionIndex]) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <img
                src={getMediaUrl(quizQuestions[visibleQuestionIndex])}
                alt="Question media"
                className="question-image"
              />
              <div className="question-answer-options">
                {answers[visibleQuestionIndex].map((ans) => {
                  const handleClick = () => {
                    setSelectedAnswerId(prevState => {
                      const newState = [...prevState];
                      newState[visibleQuestionIndex] = ans.id;
                      return newState;
                    });
                  };

                  return (
                    <div key={ans.id} onClick={() => {
                      handleClick();
                      handleAnswerChange({target: {id: ans.id, value: `${ans.text}-${ans.isCorrect}-${quizQuestions[visibleQuestionIndex].points}`}});
                    
                    }}>
                      <input
                        type="radio"
                        id={ans.id}
                        name={quizQuestions[visibleQuestionIndex].id}
                        value={`${ans.text}-${ans.isCorrect}-${quizQuestions[visibleQuestionIndex].points}`}
                        checked={
                          selectedAnswerId[visibleQuestionIndex] === ans.id
                        }
                        onChange={handleAnswerChange}
                      />
                      <label htmlFor={ans.id}>{ans.text}</label>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="question-answer-options">
              {answers[visibleQuestionIndex].map((ans) => {
                  const handleClick = () => {
                    setSelectedAnswerId(prevState => {
                      const newState = [...prevState];
                      newState[visibleQuestionIndex] = ans.id;
                      return newState;
                    });
                  };

                  return (
                    <div key={ans.id} onClick={() => {
                      handleClick();
                      handleAnswerChange({target: {id: ans.id, value: `${ans.text}-${ans.isCorrect}-${quizQuestions[visibleQuestionIndex].points}`}});
                    
                    }}>
                      <input
                        type="radio"
                        id={ans.id}
                        name={quizQuestions[visibleQuestionIndex].id}
                        value={`${ans.text}-${ans.isCorrect}-${quizQuestions[visibleQuestionIndex].points}`}
                        checked={
                          selectedAnswerId[visibleQuestionIndex] === ans.id
                        }
                        onChange={handleAnswerChange}
                      />
                      <label htmlFor={ans.id}>{ans.text}</label>
                    </div>
                  );
                })}
            </div>
          )}
          <div className="navigation-buttons">
            {quizQuestions.length > 1 && (
              <button onClick={handlePreviousQuestion}>
                Previous Question
              </button>
            )}
            {quizQuestions.length > 1 && (
              <button onClick={handleNextQuestion}>Next Question</button>
            )}
          </div>
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
