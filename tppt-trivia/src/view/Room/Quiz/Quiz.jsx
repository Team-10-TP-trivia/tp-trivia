import { useContext, useEffect, useState } from "react";
import { getQuizById } from "../../../services/QuizService/Quizzes";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
export default function Quiz() {
  const { userData } = useContext(AppContext)
  const { quizId } = useParams();
  const [ quiz, setQuiz ] = useState(null);
  const [ quizQuestions, setQuizQuestions ] = useState([]);
  const [ answers , setAnswers ] = useState([]);

  useEffect(() => {
    if(!quizId) return;
    getQuizById(quizId).then((snapshot) => {
      setQuiz(snapshot);
      setQuizQuestions(snapshot.questions);
      setAnswers(snapshot.questions.map((questionId) => {
        return Object.values(questionId.answers)
      }));
    });
  }, [quizId]);

  return (
    <div>
      {quiz ? (
        <div>
          <h1>Quiz Title: {quiz.title}</h1>
          <h2>Quiz description: {quiz.description}</h2>
          {quizQuestions.map((question) => {
            return (
              <div key={question.id}>
                <p>Question {question.id}: {question.question}</p>
                {answers && answers.map((answer) => {
                    return Object.values(answer).map((ans, i) => {
                      return (
                        <div key={i}>
                          <input type="radio" id={ans.id} name={question.id} value={ans.id}/>
                          <label htmlFor={ans.id}>{ans.text}</label>
                        </div>
                      );
                    })
                })}
              </div>
            );
          })
        }
        </div>
      ) : (
        <p>No quiz available</p>
      )}
    </div>
  );
}