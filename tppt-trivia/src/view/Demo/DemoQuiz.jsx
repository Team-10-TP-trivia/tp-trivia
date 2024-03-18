// Import necessary hooks and services
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
import { AppContext } from "../../context/appContext";

export default function DemoQuizzes() {
  const { userData } = useContext(AppContext);
  const [demoQuizzes, setDemoQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    takeAllQuizzes().then((quizzes) => {
      const filteredQuizzes = quizzes
        .filter((quiz) => quiz.visibility === "demo")
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 3);
      setDemoQuizzes(filteredQuizzes);
    });
  }, []);

  const openQuiz = (quizId) => {
    navigate(`/quiz/demo/${quizId}`);
  };

  return (
    !userData && (
      <section className="demo-quiz-container">
        <h2>Try Our Demo Quizzes</h2>
        <div>
          {demoQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="quiz-item"
              onClick={() => openQuiz(quiz.id)}
            >
              <p>{quiz.title}</p>
              <p>{quiz.description}</p>
            </div>
          ))}
        </div>
      </section>
    )
  );
}
