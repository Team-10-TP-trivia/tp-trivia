// Import necessary hooks and services
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";

export default function DemoQuizzes() {
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

//   console.log(demoQuizzes)

  const openQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <section className="demo-quiz-container">
      <h2>Try Our Demo Quiz</h2>
      <div>
        {demoQuizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-item" onClick={() => openQuiz(quiz.id)}>
            <p>{quiz.title}</p>
            <p>{quiz.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
