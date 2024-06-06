// Import necessary hooks and services
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
import { AppContext } from "../../context/appContext";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

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
      <section
        className="demo-quiz-container"
        style={{
          borderRadius: "20px",
          padding: "1rem",
          margin: "1rem",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          height: "fit-content",
          minHeight: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Try Our Demo Quizzes
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {demoQuizzes.map((quiz) => {
            return (
              <div
                key={quiz.id}
                className="quiz-item"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "start",
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${quiz.imgUrl})`,
                    width: "300px",
                    height: "fit-content",
                    minHeight: "200px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    fontSize: "1.2rem",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                  key={quiz.id}
                >
                  <p>{quiz.title}</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IoCheckmarkDoneOutline
                        style={{
                          marginRight: "5px",
                        }}
                      />
                      <p>Questions: </p>
                    </div>
                    <p>{quiz.questions.length}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IoTimeOutline
                        style={{
                          marginRight: "5px",
                        }}
                      />
                      <p>Minutes</p>
                    </div>
                    <p>{quiz.timeLimit.split(" ")[0]}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <div
                      style={{                        
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        border: "none",
                        backgroundColor: "#22223b",
                        color: "white",
                        fontSize: "1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => openQuiz(quiz.id)}
                        style={{
                          border: "none",
                          backgroundColor: "#22223b",
                          color: "white",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}
                      >
                        Take quiz
                      </button>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    )
  );
}
