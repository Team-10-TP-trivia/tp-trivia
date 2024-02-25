import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllUsers } from "../../../services/AdminServices/admin-services";

export default function AdminUsers() {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userData && userData.role === "admin") {
      getAllUsers().then((snapshot) => {
        setUsers(snapshot);
      });
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div id="admin-users-container">
        <h2>Users:</h2>
      {users.map((user, index) => {
        return (
          <div key={index}>
            <div>Username: {user.username}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            <button>Block user</button><br/><br/>
          </div>
        );
      })}
    </div>
  );
}
