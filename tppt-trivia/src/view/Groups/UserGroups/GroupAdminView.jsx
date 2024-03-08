import PropTypes from "prop-types";
import {
  approveUserRequest,
  getGroupById,
  rejectUserRequest,
} from "../../../services/Groups/Groups-services";
import SearchUsers from "./SearchUsers";

export default function GroupAdminView({ group, setGroup }) {

  const approveRequest = async (groupId, userName, user) => {
    await approveUserRequest(groupId, userName, user);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  };

  const rejectRequest = async (groupId, userName) => {
    await rejectUserRequest(groupId, userName);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  };

  return (
    <div>
        <SearchUsers group={group}/>
      <h2>Users waiting to join the group:</h2>
      {group.requests ? (
        Object.values(group.requests).map((user) => {
          return (
            <div key={user.username}>
              <p>Username: {user.username}</p>
              <p>First name: {user.firstName}</p>
              <p>Last name: {user.lastName}</p>
              <button
                onClick={() => {
                  approveRequest(group.groupId, user.username, user);
                }}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  rejectRequest(group.groupId, user.username);
                }}
              >
                Reject
              </button>
            </div>
          );
        })
      ) : (
        <h3>No request!</h3>
      )}
    </div>
  );
}

GroupAdminView.propTypes = {
  group: PropTypes.object,
  setGroup: PropTypes.func,
};
