import { useContext, useEffect, useState } from "react";
import {
  getGroupById,
  getGroupByIdOnChange,
  removeUserFromGroup,
} from "../../../services/Groups/Groups-services";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import GroupChat from "./GroupChat";
import { Button, Dialog, DialogActions, Avatar } from "@mui/material";
import GroupAdminView from "./GroupAdminView";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";


export default function OpenUserGroup() {
  const [group, setGroup] = useState(null);
  const { userData } = useContext(AppContext);
  const { groupId } = useParams();
  const [openPopup, setOpenPopup] = useState(false);
  const [showGroupUsers, setShowGroupUsers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getGroupByIdOnChange(groupId, setGroup);
    return () => unsubscribe();
  }, [groupId]);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const removeUser = async (groupId, userName) => {
    await removeUserFromGroup(groupId, userName);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  };

  const openQuizzes = () => {
    navigate(`/profile/group/${group.groupName}/groupQuizzes`, {
      state: { users: group.users },
    });
  };

  const openUsers = () => {
    setShowGroupUsers(!showGroupUsers);
  };

  if (!userData || !group) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      display={"flex"}
      sx={{ gap: "20px", width: "98%", margin: "0 0 0 20px",minHeight: "70vh", }}
      justifyContent={"space-between"}
    >
      {group && (
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems={"center"}
          sx={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "white",
            boxShadow: "8px 10px 5px 0 rgba(0,0,0,0.3)",
            height: "fit-content",
            width: "20%",
            minHeight: "400px",
          }}
        >
          <Typography variant="h4">Group Name: {group.groupName}</Typography>
          <Typography variant="p">
            Group Description: {group.groupDescription}
          </Typography>
          <Typography variant="p">
            Group creator: {group.firstName} {group.lastName}
          </Typography>
          {group.creatorUsername === userData.username && (
            <GroupAdminView group={group} setGroup={setGroup} />
          )}
        </Box>
      )}
      {showGroupUsers && group.users && (
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems={"center"}
          sx={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "white",
            boxShadow: "8px 10px 5px 0 rgba(0,0,0,0.3)",
            height: "fit-content",
            minHeight: "100px",
            width: "20%",
          }}
        >
          <h2>Group members:</h2>
          {Object.values(group.users).map((user) => {
            return (
              <Box
                key={user.uid}
                display={"flex"}
                alignItems={"center"}
                sx={{ gap: "2vw" }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <Avatar
                    src={user.photoURL}
                    alt="User Avatar"
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography variant="p">{user.username}</Typography>
                </Box>
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography variant="p">
                    First name: {user.firstName}
                  </Typography>
                  <Typography variant="p">
                    Last name: {user.lastName}
                  </Typography>
                </Box>
                {group.creatorUsername === userData.username && (
                  <ButtonForActions
                    onClick={() => {
                      removeUser(group.groupId, user.username);
                    }}
                  >
                    Remove user
                  </ButtonForActions>
                )}
              </Box>
            );
          })}
        </Box>
      )}
      <Box display={"flex"} sx={{ gap: "10px" }} justifyContent={"center"}>
        <Box>
          <ButtonForChat onClick={handleOpenPopup}>
            <IoChatbubbleEllipsesOutline />
          </ButtonForChat>
        </Box>
        <Dialog open={openPopup} onClose={handleClosePopup}>
          <DialogActions>
            {group && <Button>{group.groupName} group chat</Button>}
            <Button onClick={handleClosePopup} color="primary">
              Close
            </Button>
          </DialogActions>
          <GroupChat group={group} />
        </Dialog>
        <Box>
          <ButtonForActions onClick={openQuizzes}>See quizzes</ButtonForActions>
        </Box>
        <Box>
          <ButtonForActions onClick={openUsers}>Show users</ButtonForActions>
        </Box>
      </Box>
    </Box>
  );
}

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const ButtonForActions = styled("button")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: #FF9F45;;
  padding: 5px;
  border-radius: 5px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid #e57914;
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px #e57914, inset 0 -2px 1px #e57914;

  &:hover {
    background-color: #91fd5e;
    color: black;
  }

  &:active {
    background-color: #91fd5e;
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`
);

const ButtonForChat = styled("button")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: #FF9F45;;
  padding: 5px;
  border-radius: 5px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid #e57914;
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px #e57914, inset 0 -2px 1px #e57914;

  &:hover {
    background-color: #91fd5e;
    color: black;
  }

  &:active {
    background-color: #91fd5e;
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      background-color: ${blue[500]};
    }
  }
`
);