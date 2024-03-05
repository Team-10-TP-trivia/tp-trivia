import { useContext, useEffect, useState } from "react";
import { getAllGroups, sendJoinGroupRequest } from "../../../services/Groups/Groups-services";
import { AppContext } from "../../../context/appContext";
import SearchGroups from "./SeacrhGroups";

export default function AllGroups() {
  const [groups, setGroups] = useState(null);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = getAllGroups(setGroups);
    return () => unsubscribe();
  }, []);

  const sendRequest = (groupId, userName, user) => {
    sendJoinGroupRequest(groupId, userName, user);
  }

  if (!userData) return (<p>Loading...</p>);

  return (
    <div>
      <SearchGroups setGroups={setGroups}/>
      <h1>All groups:</h1>
      {groups ? Object.values(groups).map((group) => {
        const hasUsers = group.users && Object.keys(group.users).length > 0;
        const isRequestSent = group.requests && group.requests[userData.username] && group.requests[userData.username].approved === "pending";
        return (
          <div key={group.groupIds}>
            <h2>Group Name: {group.groupName}</h2>
            <p>Group Description: {group.groupDescription}</p>
            <p>Group creator: {group.firstName} {group.lastName}</p>
            {hasUsers ? (
              <p>You are already in this group.</p>
            ) : (
              isRequestSent ? <p>Waiting for approval</p> :
              <button onClick={() => { sendRequest(group.groupName, userData.username, userData) }}>
                Join group
              </button>
            )}
          </div>
        );
      }) : <p>No groups still available</p>}
    </div>
  );
}