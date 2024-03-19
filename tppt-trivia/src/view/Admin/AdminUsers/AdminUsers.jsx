import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import {
  blockUser,
  getAllUsers,
  unblockUser,
} from "../../../services/AdminServices/admin-services";

export default function AdminUsers() {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(users.length === 0){
      const unsubscribe = getAllUsers(setUsers);
      return () => unsubscribe();
    }
  }, [users]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const blockUserByAdmin = (user) => {
    if (user.blocked === false) {
      blockUser(user);
    } else if (user.blocked === true) {
      unblockUser(user);
    }
  };

  return (
    <div id="admin-users-container">
      <h2>Users:</h2>
      {users.map((user, index) => {
        return (
          <div key={index}>
            <div>Username: {user.username}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            <button
              onClick={() => {
                blockUserByAdmin(user);
              }}
            >
              {user.blocked ? "Unblock" : "Block"}
            </button>
            <br />
            <br />
          </div>
        );
      })}
    </div>
  );
}
