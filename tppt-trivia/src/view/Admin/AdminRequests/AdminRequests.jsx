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
  const [ documents, setDocuments ] = useState(false);

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

  const denyRequest = async (teacherUsername) => {
    await denyTeacherVerification(userData.username, teacherUsername);
  }

  const seeDocuments = () => {
    setDocuments(!documents);
  }

  return (
    <div>
      <h2>Users requests:</h2>
      {usersRequests.length > 0 ? (
        usersRequests.map((user, index) => {
          if(user.approved === false)
          return (
            <div key={index}>
              <div>First Name: {user.firstName}</div>
              <div>Last Name: {user.lastName}</div>
              <div>Email: {user.mail}</div>
              <div>School: {user.school}</div>
              {documents && <div>Documents: {user.documents}</div>}
              <button onClick={() => seeDocuments()}>See documents</button>
              <br />
              <br />
              <button onClick={() => approveRequest(user.username)}>
                Approve
              </button>
              <button onClick={() => denyRequest(user.username)}>Deny</button>
            </div>
          );
        })
      ) : (
        <div>
          <h2>Approved users:</h2>
          {usersRequests.approved === true && usersRequests.map((user, index) => {
            return (
              <div key={index}>
                <div>First Name: {user.firstName}</div>
                <div>Last Name: {user.lastName}</div>
                <div>Email: {user.mail}</div>
                <div>School: {user.school}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
