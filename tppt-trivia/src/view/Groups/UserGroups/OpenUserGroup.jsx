import { useContext, useEffect, useState } from "react";
import {
  approveUserRequest,
  getGroupById,
  getGroupByIdOnChange,
  rejectUserRequest,
  removeUserFromGroup,
} from "../../../services/Groups/Groups-services";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/appContext";
import GroupChat from "./GroupChat";
import {
  Button,
  Dialog,
  DialogActions,
  Avatar,
} from "@mui/material";
import MapsUgcIcon from '@mui/icons-material/MapsUgc';

export default function OpenUserGroup() {
  const [group, setGroup] = useState(null);
  const { userData } = useContext(AppContext);
  const { groupId } = useParams();
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    const unsubscribe = getGroupByIdOnChange(groupId, setGroup);
    return () => unsubscribe();
  }, [groupId]);

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

  const removeUser = async (groupId, userName) => {
    await removeUserFromGroup(groupId, userName);
    await getGroupById(groupId).then((snapshot) => {
      setGroup(snapshot);
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {group && (
        <div>
          <h1>Group Name: {group.groupName}</h1>
          <p>Group Description: {group.groupDescription}</p>
          <p>
            Group creator: {group.firstName} {group.lastName}
          </p>
          <h2>Users waiting to join the group:</h2>
          {group.creatorUsername === userData.username && group.requests ? (
            Object.values(group.requests).map((user) => {
              return (
                <div key={user.username}>
                  <p>Username: {user.username}</p>
                  <p>First name: {user.firstName}</p>
                  <p>Last name: {user.lastName}</p>
                  <button
                    onClick={() => {
                      approveRequest(group.groupId, user.username, user);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectRequest(group.groupId, user.username);
                    }}
                  >
                    Reject
                  </button>
                </div>
              );
            })
          ) : (
            <h3>No request!</h3>
          )}
          {group.users && (
            <div>
              <h2>Group members:</h2>
              {Object.values(group.users).map((user) => {
                return (
                  <div key={user}>
                    <Avatar
                      src={user.photoURL}
                      alt="User Avatar"
                      sx={{ width: 100, height: 100 }}
                    />
                    <p>Username: {user.username}</p>
                    <p>First name: {user.firstName}</p>
                    <p>Last name: {user.lastName}</p>
                    {group.creatorUsername === userData.username && (
                      <button
                        onClick={() => {
                          removeUser(group.groupId, user.username);
                        }}
                      >
                        Remove user
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <Button variant="contained" color="primary" sx={{ width: 2, height: 30 }} onClick={handleOpenPopup}>
        <MapsUgcIcon />
      </Button>
      <Dialog open={openPopup} onClose={handleClosePopup}>
      <DialogActions>
        {group && (
          <Button>{group.groupName} group chat</Button>
        )}
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
          <GroupChat group={group}/>
      </Dialog>
    </div>
  );
}
