import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/AdminServices/admin-services";
export default function TeacherOverview({ quiz, quizId, participants }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((snapshot) => {
      setUsers(snapshot);
    });
  }, []);

  return (
    <div>
      <h1>Teacher Overview</h1>
      <p>
        Quiz <b>{quiz.title}</b> overview
      </p>
      <p>Participants: {participants ? Object.keys(participants).length : 0}</p>
      {users &&
        users.map((user) => {
          if (user.takenQuizzes && user.takenQuizzes[quizId]) {
            return (
              <div key={user.uid}>
                <p>First name: {user.firstName}</p>
                <p>Last name: {user.lastName}</p>
                <p>
                  Right answers: {user.takenQuizzes[quizId].rightAnswers} out of{" "}
                  {user.takenQuizzes[quizId].questionLength}
                </p>
                <p>
                  Points:{" "}
                  {user.takenQuizzes[quizId]
                    ? user.takenQuizzes[quizId].receivedPoints
                    : 0} out of {user.takenQuizzes[quizId].quizPoints}
                </p>
              </div>
            );
          }
        })}
    </div>
  );
}

TeacherOverview.propTypes = {
  quiz: PropTypes.object,
  quizId: PropTypes.string,
  participants: PropTypes.object,
};
