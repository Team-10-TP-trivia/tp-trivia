import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllUsers,
  sendUserInvitation,
} from "../../../services/UserServices/user-post-services";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";
export default function SearchUsers({ group }) {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [sentUserInvitation, setSentUserInvitation] = useState(false);

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
      setUsers(filteredUsers);
      const sentUsers = allUsers.filter((user) => {
        if (
          user.groupInvitations &&
          user.groupInvitations[group.groupId] &&
          user.groupInvitations[group.groupId].status === "pending"
        ) {
          setSentUserInvitation(sentUsers);
        }
      });
    });
  }, [search, group.groupId]);

  const sendInvitation = async (username, group) => {
    await sendUserInvitation(username, group);
  };
console.log(sentUserInvitation)
  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Find people by username"
      />
      <br />
      {search !== "" &&
        users.map((user) => (
          <div key={user.id}>
            <Avatar src={user.photoURL} alt="user photo" />
            <div>Username: {user.username}</div>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
              <button
                onClick={() => {
                  sendInvitation(user.username, group);
                }}
              >
                Send Invitation
              </button>
          </div>
        ))}
    </div>
  );
}

SearchUsers.propTypes = {
  group: PropTypes.object,
};
