import { useContext, useEffect, useState } from "react";
import {
  getAllGroups,
  sendJoinGroupRequest,
} from "../../../services/Groups/Groups-services";
import { AppContext } from "../../../context/appContext";
import SearchGroups from "./SeacrhGroups";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AllGroups() {
  const [groups, setGroups] = useState(null);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = getAllGroups(setGroups);
    return () => unsubscribe();
  }, []);

  const sendRequest = (groupId, userName, user) => {
    sendJoinGroupRequest(groupId, userName, user);
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <SearchGroups setGroups={setGroups} />
      <Typography variant="h4">All groups:</Typography>
      <Box display={"flex"} sx={{minHeight: "80vh", height: "fit-content"}}>
        {groups ? (
          Object.values(groups).map((group, index) => {
            const hasUsers = group.users && group.users[userData.username];
            const isRequestSent =
              group.requests &&
              group.requests[userData.username] &&
              group.requests[userData.username].approved === "pending";
            return (
              <Box key={index} sx={{marginLeft: "20px", 
              marginTop:"10px", 
              border: "1px solid black", 
              borderRadius: "10px", 
              height: "fit-content", 
              padding: "20px", 
              boxShadow: "0 10px 10px 0 rgba(0,0,0,0.2)",
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                boxShadow: "0 10px 10px 0 rgba(0,0,0,0.5)",
                transform: "scale(1.05)",
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            }} 
              display={"flex"} 
              flexDirection={"column"} 
              alignItems={"center"}>
                <Typography variant="h5" sx={{marginBottom:"15px"}}>Group Name: {group.groupName}</Typography>
                <Typography variant="p" sx={{fontSize:"20px"}}>Group Description: {group.groupDescription}</Typography>
                <Typography variant="p" sx={{fontSize:"20px"}}>Group creator: {group.firstName} {group.lastName}</Typography>
                {hasUsers ? (
                  <Typography variant="p" sx={{color: "green", fontSize:"20px"}}>You are already in this group.</Typography>
                ) : isRequestSent ? (
                  <Typography variant="p" sx={{color: "#e8b312", fontSize:"20px"}}>Waiting for approval</Typography>
                ) : (
                  <button
                    onClick={() => {
                      sendRequest(group.groupName, userData.username, userData);
                    }}
                  >
                    Join group
                  </button>
                )}
              </Box>
            );
          })
        ) : (
          <p>No groups still available</p>
        )}
      </Box>
    </>
  );
}
