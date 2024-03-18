import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllGroups } from "../../../services/Groups/Groups-services";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import Typography from "@mui/material/Typography";

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
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      onClick={() => showUserGroups()}
      sx={{ cursor: "pointer", gap: "5px"}}
    >
      <GroupsIcon />
      {userData.role === "teacher" && (
        <span style={{ marginLeft: "5px" }}>Show groups</span>
      )}
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
              <Box
                key={index}
                onClick={() => openGroup(group.groupName)}
                style={{ cursor: "pointer" }}
              >
                <Typography variant="h6">Group Name: {group.groupName}</Typography>
                <Typography variant="p">Group Description: {group.groupDescription}</Typography>
              </Box>
            );
          }
          return null;
        })}
      {userData.role === "teacher" && groups.length === 0 && (
        <Typography variant="p">No groups still available</Typography>
      )}
    </Box>
  );
}
