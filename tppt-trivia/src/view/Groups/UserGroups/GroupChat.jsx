import PropTypes from "prop-types";
import {
  deleteUserMessage,
  getGroupMessages,
  sendMessageToGroup,
  updateUserMessage,
} from "../../../services/Groups/Groups-services";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { getAllUsers } from "../../../services/UserServices/user-post-services";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Avatar } from "@mui/material";
import "./GroupChat.css";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { IoIosSend } from "react-icons/io";


export default function GroupChat({ group }) {
  const { userData } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState(null);
  const [groupMessages, setGroupMessages] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [changeUserMessage, setChangeUserMessage] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState({
    id: null,
    content: "",
  });

  const outerTheme = useTheme();

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
      }, 2000);
      return;
    }
    await sendMessageToGroup(group.groupId, userData, message);
    setMessage("");
  };

  const userMessageUpdateFunction = (message, messageByUser) => {
    updateUserMessage(
      group.groupId,
      userData.username,
      message.id,
      messageByUser
    );
    setChangeUserMessage(!changeUserMessage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMessage((prevState) => ({ ...prevState, [name]: value }));
  };

  const refreshEditButton = (messageID) => {
    if (messageID === messageId) {
      setMessageId(null);
    }
    setMessageId(messageID);
  };

  const deleteMessage = (messageID) => {
    deleteUserMessage(group.groupId, userData.username, messageID);
  };

  if (!group || !userData || !users) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <Box display={"flex"} alignItems={"center"} gap={"20px"} justifyContent={"center"}>
        {emptyMessage && <p>Message cannot be empty</p>}
        <ThemeProvider theme={customTheme(outerTheme)}>
          <TextField
            label="Message"
            variant="filled"
            type="text"
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </ThemeProvider>
        <ButtonForChat onClick={sendMessage}>
          <IoIosSend />
        </ButtonForChat>
      </Box>
      {groupMessages &&
        Object.values(groupMessages)
          .flatMap((userMessages) => Object.values(userMessages))
          .sort((a, b) => b.timestamp - a.timestamp)
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
                  <Typography variant="p">{user.username}</Typography>
                  <span>
                    {new Date(singleMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="message-options-container">
                  <div>
                    {changeUserMessage && messageId === singleMessage.id ? (
                      <div>
                        <input
                          type="text"
                          name="content"
                          value={
                            editedMessage.content
                              ? editedMessage.content
                              : singleMessage.message
                          }
                          onChange={handleInputChange}
                        />
                        <button
                          onClick={() => {
                            setEditedMessage({
                              id: singleMessage.id,
                              content: editedMessage.content,
                            });
                            userMessageUpdateFunction(
                              singleMessage,
                              editedMessage.content
                            );
                          }}
                        >
                          Edit message
                        </button>
                      </div>
                    ) : (
                      <div>{singleMessage.message}</div>
                    )}
                    <br />
                    {showDetails === singleMessage.id &&
                      userData.username === singleMessage.sender && (
                        <p className="message-options">
                          <span>
                            <EditIcon
                              id="edit"
                              className="edit-delete"
                              onClick={() => {
                                setMessageId(singleMessage.id);
                                refreshEditButton(singleMessage.id);
                                setChangeUserMessage(!changeUserMessage);
                              }}
                            />
                            <DeleteForeverIcon
                              id="delete"
                              className="edit-delete"
                              onClick={() => {
                                deleteMessage(singleMessage.id);
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

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#91fd5e",
            "--TextField-brandBorderHoverColor": "#91fd5e",
            "--TextField-brandBorderFocusedColor": "#91fd5e",
            "& label.Mui-focused": {
              color: "#91fd5e",
              fontSize: "25px",
            },
            marginBottom: "10px",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&::before, &::after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: "20px",
          },
        },
      },
    },
  });

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const ButtonForChat = styled("button")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: #FF9F45;;
    padding: 5px;
    border-radius: 5px;
    width: 50px;
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
