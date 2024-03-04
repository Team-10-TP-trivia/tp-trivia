import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllGroups } from "../../../services/Groups/Groups-services";
import { useNavigate } from "react-router-dom";

export default function UserGroups() {

    const { userData } = useContext(AppContext);
    const [ groups, setGroups ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = getAllGroups(setGroups);
        return () => unsubscribe();
    }, []);

    if(!userData) return null;

    const openGroup = (groupId) => {
        navigate(`group/${groupId}`);
    }

    if(!groups) {
        return <div>Loading...</div>
    }

  return (
    <div>
    <h1>{userData.firstName} {userData.lastName} groups:</h1>
    {groups && Object.values(groups).map((group, index) => {
      if (group.userId === userData.uid || (group.users && Object.keys(group.users).includes(userData.username))) {
        return (
          <div key={index}>
            <h2>Group Name: {group.groupName}</h2>
            <p>Group Description: {group.groupDescription}</p>
            <button onClick={() => openGroup(group.groupName)}>Open Group</button>
          </div>
        );
      }
      return null;
    })}
    {!groups && <p>No groups still available</p>} 
  </div>  
  );
}