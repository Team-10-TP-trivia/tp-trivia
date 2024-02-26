import { useEffect, useState } from "react";
import { getAllGroups } from "../../../services/Groups/Groups-services";

export default function AllGroups() {
    const [ groups, setGroups ] = useState([]);

    useEffect(() => {
        // Initialize the listener and pass the state setter function
        const unsubscribe = getAllGroups(setGroups);
        
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);


  return (
    <div>
        <h1>All groups:</h1>
      {groups ? Object.keys(groups).map((key) => {
        return (
          <div key={key}>
            <h2>Group Name: {groups[key].groupName}</h2>
            <p>Group Description: {groups[key].groupDescription}</p>
            <p>Group creator: {groups[key].firstName} {groups[key].lastName}</p>
            <button>Join group</button>
          </div>
        );
      }) : <p>No groups still available</p>}
    </div>
  );
}