import { useState } from "react";
import { useLocation } from "react-router-dom";
import { updateQuiz } from "../../services/QuizService/Quizzes";
import { useNavigate } from "react-router-dom";
import "./EditQuiz.css";

export default function EditQuiz() {
  const location = useLocation();
  const quizFromQuizPage = location.state.quiz;
  const [quiz, setQuiz] = useState(quizFromQuizPage);
  const navigate = useNavigate();
  const [updatedQuiz, setUpdatedQuiz] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("question")) {
      const questionIndex = parseInt(name.replace("question", ""));
      setQuiz((prevState) => {
        const updatedQuestions = [...prevState.questions];
        updatedQuestions[questionIndex].question = value;
        return { ...prevState, questions: updatedQuestions };
      });
    } else if (name.startsWith("answer")) {
      const [, questionIndex, answerIndex] = name.split("_");
      setQuiz((prevState) => {
        const updatedQuestions = [...prevState.questions];
        const updatedAnswers = [...updatedQuestions[questionIndex].answers];
        updatedAnswers[answerIndex].text = value;
        updatedQuestions[questionIndex].answers = updatedAnswers;
        return { ...prevState, questions: updatedQuestions };
      });
    } else {
      setQuiz((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const saveChanges = () => {
    updateQuiz(quiz.id, quiz);
    setUpdatedQuiz("Quiz updated successfully");
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  const showABCD = (index) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="edit-quiz-layout">
      {updatedQuiz && <div>{updatedQuiz}</div>}
      <h1>Description: {quiz.description}</h1>
      <div>
        <label htmlFor="description">Change quiz description</label>
        <br />
        <input
          type="text"
          id="description"
          name="description"
          value={quiz.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h1>Title: {quiz.title}</h1>
        <label htmlFor="title">Change quiz title</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          value={quiz.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        {quiz.questions &&
          quiz.questions.map((question, questionIndex) => {
            return (
              <div key={question.id}>
                <h2>Question: {question.question}</h2>
                <label htmlFor={`question_${questionIndex}`}>
                  Change question
                </label>
                <br />
                <input
                  type="text"
                  id={`question_${questionIndex}`}
                  name={`question${questionIndex}`}
                  value={question.question}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                {question.answers.map((answer, answerIndex) => {
                  return (
                    <div key={answer.id}>
                      <label htmlFor={`answer_${questionIndex}_${answerIndex}`}>
                        Answer {showABCD(answerIndex)} :
                      </label>
                      <input
                        type="text"
                        id={`answer_${questionIndex}_${answerIndex}`}
                        name={`answer_${questionIndex}_${answerIndex}`}
                        value={answer.text}
                        onChange={handleInputChange}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        <br />
        <button onClick={saveChanges}>Save Changes</button>
      </div>
    </div>
  );
}
