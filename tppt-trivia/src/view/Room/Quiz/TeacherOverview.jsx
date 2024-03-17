import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./TeacherOverview.css";
import {
  findStudents,
  sendQuizInvitation,
} from "../../../services/TeacherServices/teacher-services";
import { getAllUsers } from "../../../services/AdminServices/admin-services";
import { AppContext } from "../../../context/appContext";

export default function TeacherOverview({ quiz, quizId, participants }) {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [invitationSent, setInvitationSent] = useState(false);

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    const f = async () => {
      const unsubscribe = await getAllUsers(setUsers);
      return () => unsubscribe();
    };
    // if(userData && userData.role === "teacher") {
    // const unsubscribe = getAllUsers(setUsers);
    // return () => unsubscribe();
    // }
    f();
  }, [userData]);

  useEffect(() => {
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

  if(!userData) return (<p>Loading...</p>);

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
        {students &&
          students.map((student) => {
            return (
              <div key={student.uid} className="found-student">
                <p>First name: {student.firstName}</p>
                <p>Last name: {student.lastName}</p>
                <p>Email: {student.email}</p>
                <button onClick={() => sendInvite(student.username)}>
                  Send Invite for quiz
                </button>
              </div>
            );
          })}
        {invitationSent && <p>Invitation sent!</p>}
      </div>
      <div id="students-results">
        <h2>
          Participants: {participants ? Object.keys(participants).length : 0}
        </h2>
        {users &&
          users.map((user) => {
            if (user.takenQuizzes && user.takenQuizzes[quizId]) {
              return (
                <div key={user.uid}>
                  <p>First name: {user.firstName}</p>
                  <p>Last name: {user.lastName}</p>
                  <p>
                    Right answers: {user.takenQuizzes[quizId].rightAnswers} out
                    of {user.takenQuizzes[quizId].questionLength}
                  </p>
                  <p>
                    Points:{" "}
                    {user.takenQuizzes[quizId]
                      ? user.takenQuizzes[quizId].receivedPoints
                      : 0}{" "}
                    out of {user.takenQuizzes[quizId].quizPoints}
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
