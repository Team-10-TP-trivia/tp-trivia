import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/AdminServices/admin-services";
import { useSearchParams } from "react-router-dom";
import "./TeacherOverview.css";
import { findStudents, sendQuizInvitation } from "../../../services/TeacherServices/teacher-services";
export default function TeacherOverview({ quiz, quizId, participants }) {
  const [users, setUsers] = useState([]);
  const [ students, setStudents ] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [ invitationSent, setInvitationSent ] = useState(false);

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

  const sendInvite = (studentName) => {
      setInvitationSent(true);

    sendQuizInvitation(studentName, quiz, quizId);

    setTimeout(() => {
      setInvitationSent(false);
    }, 2000);
  };

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
            <button onClick={() => sendInvite(student.username)}>Send Invite for quiz</button>
          </div>
        );
      })}
      {invitationSent && <p>Invitation sent!</p>}
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
