import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllGroups } from "../../../services/Groups/Groups-services";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

export default function UserGroups() {
  const { userData } = useContext(AppContext);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const [showGroups, setShowGroups] = useState(false);

  useEffect(() => {
    if (userData.role !== "teacher") return;
    const unsubscribe = getAllGroups(setGroups);
    return () => unsubscribe();
  }, [userData.role]);

  if (!userData) return null;

  const openGroup = (groupId) => {
    navigate(`group/${groupId}`);
  };

  const showUserGroups = () => {
    setShowGroups(!showGroups);
  };

  if (!groups) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} onClick={() => showUserGroups()} sx={{cursor: "pointer"}}>
        <GroupsIcon />
        {userData.role === "teacher" && <span style={{marginLeft: "5px"}}>Show groups</span>}
      </Box>
      {showGroups &&
        userData.role === "teacher" &&
        groups &&
        Object.values(groups).map((group, index) => {
          if (
            group.userId === userData.uid ||
            (group.users &&
              Object.keys(group.users).includes(userData.username))
          ) {
            return (
              <div
                key={index}
                onClick={() => openGroup(group.groupName)}
                style={{ cursor: "pointer" }}
              >
                <h2>Group Name: {group.groupName}</h2>
                <p>Group Description: {group.groupDescription}</p>
              </div>
            );
          }
          return null;
        })}
      {userData.role === "teacher" && groups.length === 0 && (
        <p>No groups still available</p>
      )}
    </Box>
  );
}
