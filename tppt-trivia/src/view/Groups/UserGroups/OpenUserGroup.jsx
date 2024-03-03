import { useContext, useEffect, useState } from "react";
import { approveUserRequest, getGroupById, rejectUserRequest, removeUserFromGroup } from "../../../services/Groups/Groups-services";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/appContext";

export default function OpenUserGroup() {
  const [group, setGroup] = useState(null);
  const { userData } = useContext(AppContext);
  const { groupId } = useParams();

  useEffect(() => {
    getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  }, [groupId]);

  const approveRequest = async (groupId, userName,user ) => {
    await approveUserRequest(groupId, userName, user);
    await getGroupById(groupId).then((snapshot) => {
        setGroup(snapshot);
      });
  }

  const rejectRequest = async (groupId, userName) => {
    await rejectUserRequest(groupId, userName);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  }

  const removeUser = async (groupId, userName) => {
     await removeUserFromGroup(groupId, userName);
     await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  }

  if(!userData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {group && (
        <div>
          <h1>Group Name: {group.groupName}</h1>
          <p>Group Description: {group.groupDescription}</p>
          <p>Group creator: {group.firstName} {group.lastName}</p>
          <h2>Users waiting to join the group:</h2>
          {(group.creatorUsername === userData.username && group.requests) ? Object.values(group.requests).map((user) => {
            return (
              <div key={user.username}>
                <p>Username: {user.username}</p>
                <p>First name: {user.firstName}</p>
                <p>Last name: {user.lastName}</p>
                <button onClick={() => {approveRequest(group.groupId, user.username, user)}}>Approve</button>
                <button onClick={() => {rejectRequest(group.groupId, user.username)}}>Reject</button>
              </div>
            );
          }) : <h3>No request!</h3>}
          {group.users && (
            <div>
              <h2>Group members:</h2>
              {Object.values(group.users).map((user) => {
                return (
                  <div key={user}>
                    <img src={user.photoURL} alt="" />
                    <p>Username: {user.username}</p>
                    <p>First name: {user.firstName}</p>
                    <p>Last name: {user.lastName}</p>
                    <button onClick={() => {removeUser(group.groupId, user.username)}}>Remove user</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
