import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllPendingVerifications } from "../../../services/AdminServices/admin-services";

export default function AdminRequests() {
  const { userData } = useContext(AppContext);
  const [usersRequests, setUsersRequests] = useState([]);

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h2>Users requests:</h2>
        {usersRequests.length > 0 && usersRequests.map((user, index) => {
            return (
            <div key={index}>
                <div>First Name: {user.firstName}</div>
                <div>Last Name: {user.lastName}</div>
                <div>Email: {user.mail}</div>
                <div>School: {user.school}</div>
                <button>See documents</button><br /><br />
            </div>
            );
        })}
    </div>
  );
}
