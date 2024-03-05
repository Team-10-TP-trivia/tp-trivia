import PropTypes from "prop-types";
import {
  getGroupMessages,
  sendMessageToGroup,
} from "../../../services/Groups/Groups-services";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllUsers } from "../../../services/UserServices/user-post-services";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Avatar } from "@mui/material";
import "./GroupChat.css";

export default function GroupChat({ group }) {
  const { userData } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState(null);
  const [groupMessages, setGroupMessages] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    getAllUsers().then((snapshot) => {
      setUsers(snapshot);
    });
  }, []);

  useEffect(() => {
    if (group) {
      const unsubscribe = getGroupMessages(group.groupId, setGroupMessages);
      return () => unsubscribe();
    }
  }, [group]);

  const sendMessage = async () => {
    if (!group) return;
    if (message === "") {
      setEmptyMessage(true);
      setTimeout(() => {
        setEmptyMessage(false);
      }, 2000); // Set timeout to remove the error message after 2 seconds
      return;
    }
    await sendMessageToGroup(group.groupId, userData, message);
    setMessage("");
  };

  if (!group || !userData || !users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <div>
      {emptyMessage && <p>Message cannot be empty</p>}
        <input
          type="text"
          id="message"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send message</button>
      </div>
      {groupMessages &&
        Object.values(groupMessages)
          .flatMap((userMessages) => Object.values(userMessages))
          .sort((a, b) => b.timestamp - a.timestamp) // Sort all messages by timestamp
          .map((singleMessage) => {
            const user = users.find(
              (user) => user.username === singleMessage.sender
            );

            return (
              <li
                key={singleMessage.id}
                onMouseEnter={() => setShowDetails(singleMessage.id)}
                onMouseLeave={() => {
                  setShowDetails(null);
                }}
                className="single-message"
              >
                <div className="imgUsername-container">
                  <Avatar
                    src={user.photoURL}
                    alt="User Avatar"
                    className="profile-avatar"
                    sx={{ width: 50, height: 50 }}
                  />
                  <p>{user.username}</p>
                  <span>
                    {new Date(singleMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="message-options-container">
                  <div>
                    <div>{singleMessage.message}</div>
                    <br />
                    {showDetails === singleMessage.id &&
                      userData.username === singleMessage.sender && (
                        <p className="message-options">
                          <span>
                            <EditIcon
                              id="edit"
                              className="edit-delete"
                              onClick={() => {
                                console.log("Raboti");
                              }}
                            />
                            <DeleteForeverIcon
                              id="delete"
                              className="edit-delete"
                              onClick={() => {
                                console.log("I TOVA Raboti");
                              }}
                            />
                          </span>
                        </p>
                      )}
                  </div>
                </div>
              </li>
            );
          })}

      {(!groupMessages || Object.values(groupMessages).length === 0) && (
        <p>No messages available</p>
      )}
    </div>
  );
}

GroupChat.propTypes = {
  group: PropTypes.object,
};
