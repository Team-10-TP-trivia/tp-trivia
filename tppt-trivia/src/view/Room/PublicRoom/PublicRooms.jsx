import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function PublicRooms({ quizList }) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setQuizzes(quizList.filter((quiz) => quiz.visibility === "public"));
  }, [quizList]);

  return (
    <div>
      <h1>Public Rooms</h1>
      {quizzes ? (
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
        <p>No quizzes available</p>
      )}
    </div>
  );
}

PublicRooms.propTypes = {
  quizList: PropTypes.array,
};
