import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { findStudents, getAllUsers } from "../../../services/AdminServices/admin-services";
import { useSearchParams } from "react-router-dom";
import "./TeacherOverview.css";
export default function TeacherOverview({ quiz, quizId, participants }) {
  const [users, setUsers] = useState([]);
  const [ students, setStudents ] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllUsers().then((snapshot) => {
      setUsers(snapshot);
    });
    findStudents(search).then((snapshot) => {
      setStudents(snapshot);
    });
  }, [search]);

  return (
    <div id="teacher-overview">
      <div id="find-students">
      <h1>Teacher Overview</h1>
      <p>
        Quiz <b>{quiz.title}</b> overview
      </p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search students by name"
      />
      {students && students.map((student) => {
        return (
          <div key={student.uid} className="found-student">
            <p>First name: {student.firstName}</p>
            <p>Last name: {student.lastName}</p>
            <p>Email: {student.email}</p>
            <button>Send Invite for quiz</button>
          </div>
        );
      })}
      </div>
      <div id="students-results">
      <h2>Participants: {participants ? Object.keys(participants).length : 0}</h2>
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
    </div>
  );
}

TeacherOverview.propTypes = {
  quiz: PropTypes.object,
  quizId: PropTypes.string,
  participants: PropTypes.object,
};
