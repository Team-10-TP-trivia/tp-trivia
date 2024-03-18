import { useContext, useEffect, useState } from "react";
import {
  getGroupById,
  getGroupByIdOnChange,
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
import GroupAdminView from "./GroupAdminView";
import { useNavigate } from "react-router-dom";

export default function OpenUserGroup() {
  const [group, setGroup] = useState(null);
  const { userData } = useContext(AppContext);
  const { groupId } = useParams();
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate()

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
    navigate(`/profile/group/${group.groupName}/groupQuizzes`, { state: { users: group.users } })
  }

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
          {group.creatorUsername === userData.username && (
            <GroupAdminView group={group} setGroup={setGroup}/>
            )}
          {group.users && (
            <div>
              <h2>Group members:</h2>
              {Object.values(group.users).map((user) => {
                return (
                  <div key={user.uid}>
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
      <h3>Open quizzes created by group participants</h3>
      <button onClick={openQuizzes}>See quizzes</button>
    </div>
  );
}
