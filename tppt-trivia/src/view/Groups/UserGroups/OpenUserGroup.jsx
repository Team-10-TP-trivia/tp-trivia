import { useEffect, useState } from "react";
import { approveUserRequest, getGroupById } from "../../../services/Groups/Groups-services";
import { useParams } from "react-router-dom";

export default function OpenUserGroup() {
  const [group, setGroup] = useState([]);
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

  return (
    <div>
      {group && (
        <div>
          <h1>Group Name: {group.groupName}</h1>
          <p>Group Description: {group.groupDescription}</p>
          <p>Group creator: {group.firstName} {group.lastName}</p>
          <h2>Users waiting to join the group:</h2>
          {group.requests ? Object.keys(group.requests).map((key) => {
            return (
              <div key={key}>
                <p>Username: {group.requests[key].username}</p>
                <p>First name: {group.requests[key].firstName}</p>
                <p>Last name: {group.requests[key].lastName}</p>
                <button onClick={() => {approveRequest(group.groupId, group.requests[key].username, group.requests[key])}}>Approve</button>
                <button onClick={() => {}}>Reject</button>
              </div>
            );
          }) : <h3>No request!</h3>}
          {group.users && (
            <div>
              <h2>Group members:</h2>
              {Object.keys(group.users).map((key) => {
                return (
                  <div key={key}>
                    <img src={group.users[key].photoURL} alt="" />
                    <p>Username: {group.users[key].username}</p>
                    <p>First name: {group.users[key].firstName}</p>
                    <p>Last name: {group.users[key].lastName}</p>
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
