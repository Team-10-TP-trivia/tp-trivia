import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function PrivateRooms({ quizList }) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setQuizzes(quizList.filter((quiz) => quiz.visibility === "private"));
  }, [quizList]);

  return (
    <div>
      <h1>Private Rooms</h1>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          return (
            <div key={quiz.id}>
              <p>Quiz Title: {quiz.title}</p>
              <p>Quiz description: {quiz.description}</p>
              <button>Join Quiz</button>
            </div>
          );
        })
      ) : (
        <p>No private quizzes available</p>
      )}
    </div>
  );
}

PrivateRooms.propTypes = {
  quizList: PropTypes.array,
};
