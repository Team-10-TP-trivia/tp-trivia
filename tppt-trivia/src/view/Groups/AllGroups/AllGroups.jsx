import { useContext, useEffect, useState } from "react";
import { getAllGroups, sendJoinGroupRequest } from "../../../services/Groups/Groups-services";
import { AppContext } from "../../../context/appContext";

export default function AllGroups() {
  const [ groups, setGroups ] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = getAllGroups(setGroups);
    return () => unsubscribe();
  }, []);

  const sendRequest = (groupId, userName, user) => {
    sendJoinGroupRequest(groupId, userName, user);
  }

  return (
    <div>
      <h1>All groups:</h1>
      {groups ? Object.keys(groups).map((key) => {
        return (
          <div key={key}>
            <h2>Group Name: {groups[key].groupName}</h2>
            <p>Group Description: {groups[key].groupDescription}</p>
            <p>Group creator: {groups[key].firstName} {groups[key].lastName}</p>
            <button onClick={() => {sendRequest(key, userData.username, userData)}}>Join group</button>
          </div>
        );
      }) : <p>No groups still available</p>}
    </div>
  );
}