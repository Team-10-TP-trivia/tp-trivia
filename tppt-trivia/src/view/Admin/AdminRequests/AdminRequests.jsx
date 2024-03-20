import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import {
  approveTeacherVerification,
  denyTeacherVerification,
  getAllPendingVerifications,
} from "../../../services/AdminServices/admin-services";

export default function AdminRequests() {
  const { userData } = useContext(AppContext);
  const [usersRequests, setUsersRequests] = useState([]);
  const [documents, setDocuments] = useState(Array(usersRequests.length).fill(false));

  useEffect(() => {
    if (userData && userData.role === "admin") {
      getAllPendingVerifications(userData.username).then((snapshot) => {
        const r = Object.keys(snapshot).map((key) => ({
          id: key,
          ...snapshot[key],
        }));
        setUsersRequests(r);
      });
    }
  }, [userData]);

  //   if (!userData) {
  //     return <div>Loading...</div>;
  //   }

  const approveRequest = async (teacherUsername) => {
    await approveTeacherVerification(userData.username, teacherUsername);
  };

  const denyRequest = async (adminUsername, teacherUsername) => {
    await denyTeacherVerification(adminUsername, teacherUsername);
  };

  const seeDocuments = (index) => {
    setDocuments((prev) => {
      const newDocuments = [...prev];
      newDocuments[index] = !newDocuments[index];
      return newDocuments;
    });
  };

  return (
    <div>
      <h2>Users requests:</h2>
      {usersRequests.length > 0 &&
        usersRequests.map((user, index) => {
          if (user.approved === "pending") {
            return (
              <div key={index}>
                <div>First Name: {user.firstName}</div>
                <div>Last Name: {user.lastName}</div>
                <div>Email: {user.mail}</div>
                <div>School: {user.school}</div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {documents[index] && (
                    <img
                      src={user.photoURL}
                      alt="documents"
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                    />
                  )}
                  <button onClick={() => seeDocuments(index)}>See documents</button>
                </div>
                <br />
                <br />
                <button onClick={() => approveRequest(user.username)}>
                  Approve
                </button>
                <button
                  onClick={() => denyRequest(userData.username, user.username)}
                >
                  Deny
                </button>
              </div>
            );
          }
          if (user.approved === false) {
            return (
              <div key={index}>
                <h2>Denied users:</h2>
                <div>First Name: {user.firstName}</div>
                <div>Last Name: {user.lastName}</div>
                <div>Email: {user.mail}</div>
                <div>School: {user.school}</div>
              </div>
            );
          }
          if (user.approved === true) {
            return (
              <div key={index}>
                <h2>Approved users:</h2>
                <div>First Name: {user.firstName}</div>
                <div>Last Name: {user.lastName}</div>
                <div>Email: {user.mail}</div>
                <div>School: {user.school}</div>
              </div>
            );
          }
        })}
    </div>
  );
}
