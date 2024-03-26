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
      <section className="demo-quiz-container" style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
        padding: "1rem",
        margin: "1rem",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        height: "fit-content",
        minHeight: "400px",
      }}>
        <h2 style={{
          textAlign: "center",
        }}>Try Our Demo Quizzes</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {demoQuizzes.map((quiz) => {
            return <div
              key={quiz.id}
              className="quiz-item"
              onClick={() => openQuiz(quiz.id)}
              style={{
                backdropFilter: "blur(5px)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: "rgba(100, 150, 200, 1)",
                padding: "1rem",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <img src={quiz.imgUrl} alt="" style={{
                width: "250px",
                height: "fit-content",
                minHeight: "150px",
                objectFit: "contain",
                borderRadius: "10px",
              }}/>
              <p>{quiz.title}</p>
              <p>{quiz.description}</p>
            </div>
          })}
        </div>
      </section>
    )
  );
}
