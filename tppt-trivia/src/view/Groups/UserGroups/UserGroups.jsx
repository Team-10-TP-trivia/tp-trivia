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

  return (
    <div>
      <h1>{userData.firstName} {userData.lastName} groups:</h1>
      {groups ? Object.keys(groups).map((key) => {
        if (groups[key].userId === userData.uid) {
          return (
            <div key={key}>
              <h2>Group Name: {groups[key].groupName}</h2>
              <p>Group Description: {groups[key].groupDescription}</p>
              <button onClick={() => openGroup(key, groups[key])}>Open Group</button>
            </div>
          );
        }
        return null;
      }) : <p>No groups still available</p>}
    </div>
  );
}