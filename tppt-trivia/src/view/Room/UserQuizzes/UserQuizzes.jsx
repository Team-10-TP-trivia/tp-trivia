import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import PropTypes from "prop-types";

export default function UserQuizzes({ quizList }) {
  const { userData } = useContext(AppContext);
  const [userQuizzes, setUserQuizzes] = useState([]);
  useEffect(() => {
    if (!userData || !userData.uid) return;
    setUserQuizzes(quizList.filter((quiz) => quiz.creatorId === userData.uid));
  }, [userData, quizList]);

  return (
    <div>
      <h1>User Quizzes</h1>
      {userQuizzes ? (
        userQuizzes.map((quiz) => {
          return (
            <div key={quiz}>
              <h2>Quiz Name: {quiz.description}</h2>
              <p>Quiz Description: {quiz.description}</p>
              <p>Quiz creator: {quiz.username}</p>
              <button>Edit quiz</button>
            </div>
          );
        })
      ) : (
        <p>No quizzes still available</p>
      )}
    </div>
  );
}

UserQuizzes.propTypes = {
  quizList: PropTypes.array,
};
