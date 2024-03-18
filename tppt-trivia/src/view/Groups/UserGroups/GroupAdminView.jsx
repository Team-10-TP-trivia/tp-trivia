import PropTypes from "prop-types";
import {
  approveUserRequest,
  deleteGroupByGroupName,
  getGroupById,
  rejectUserRequest,
} from "../../../services/Groups/Groups-services";
import SearchUsers from "./SearchUsers";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";

export default function GroupAdminView({ group, setGroup }) {
  const navigate = useNavigate()

  const approveRequest = async (groupId, userName, user) => {
    await approveUserRequest(groupId, userName, user);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  };

  const rejectRequest = async (groupId, userName) => {
    await rejectUserRequest(groupId, userName);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  };
  const deleteGroup = () => {
    deleteGroupByGroupName(group.groupName);
    navigate(-1)
  };
  return (
    <Box display={"flex"} flexDirection={"column"} sx={{
      height: "fit-content",
    }}>
      <SearchUsers group={group} />
      <Typography variant={"h5"}>Users waiting to join the group:</Typography>
      {group.requests ? (
        Object.values(group.requests).map((user) => {
          return (
            <div key={user.username}>
              <p>Username: {user.username}</p>
              <p>First name: {user.firstName}</p>
              <p>Last name: {user.lastName}</p>
              <Button
                onClick={() => {
                  approveRequest(group.groupId, user.username, user);
                }}
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  rejectRequest(group.groupId, user.username);
                }}
              >
                Reject
              </Button>
            </div>
          );
        })
      ) : (
        <h3>No request!</h3>
      )}
      <Box display={"flex"} justifyContent={"center"}>
      <Button onClick={() => {deleteGroup()}}>Delete Group</Button>
      </Box>
    </Box>
  );
}

GroupAdminView.propTypes = {
  group: PropTypes.object,
  setGroup: PropTypes.func,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const Button = styled("button")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: #FF9F45;
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
    color: black;
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