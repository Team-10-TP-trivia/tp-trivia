import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import VerifyTeacher from "./VerifyTeacher/VerifyTeacher";
import { getUserByHandle } from "../../services/UserServices/user-services";
import {
  updateUserDetails,
  uploadProfilePicture,
  userAcceptRequest,
  userRejectRequest,
} from "../../services/UserServices/user-post-services";
import { useNavigate } from "react-router-dom";
import UserGroups from "../Groups/UserGroups/UserGroups";
import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/system";
import { userRejectQuiz } from "../../services/QuizService/Quizzes";
import { userAcceptedQuiz } from "../../services/TeacherServices/teacher-services";

const Profile = () => {
  const { userData } = useContext(AppContext);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [userError, setUserError] = useState(false);
  const [selectPhotoError, setSelectPhotoError] = useState(false);

  useEffect(() => {
    if (userData && userData.username) {
      getUserByHandle(userData.username)
        .then((user) => {
          const userVal = user.val();
          if (userVal) {
            setPhotoURL(userVal.photoURL);
            if (userVal.groupInvitations) {
              setNotifications(Object.values(userVal.groupInvitations));
            }
            if (userVal.quizInvitations) {
              setStudentNotifications(userVal.quizInvitations);
            }
          }
        })
        .catch((error) => {
          setUserError(error.message);
          setTimeout(() => {
            setUserError(false);
          }, 2000);
        });
    }
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const downloadURL = await uploadProfilePicture(userData.username, photo);
      await updateUserDetails(userData.username, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
    } catch (error) {
      setSelectPhotoError(error.message);

      setTimeout(() => {
        setSelectPhotoError(false);
      }, 2000);
    }
  };

  const handleJoinGroup = (groupName) => {
    userAcceptRequest(groupName, userData.username, userData);
  };

  const handleRejectGroup = (groupName) => {
    userRejectRequest(groupName, userData.username);
  };

  const handleAcceptQuiz = (quiz) => {
    userAcceptedQuiz(userData.username, quiz.quizId);
    navigate(`/quiz/${quiz.quizId}`);
  };

  const handleRejectQuiz = (quiz) => {
    userRejectQuiz(userData.username, quiz);
  };

  return (
    <Box
      display="flex"
      justifyContent={"space-between"}
      marginTop={"20px"}
      sx={{ backgroundColor: "charcoal" }}
    >
      {userError && <div>{userError}</div>}
      <Box display="flex" flexDirection={"column"} alignItems={"center"}>
        {photoURL && (
          <Avatar
            src={photoURL}
            alt="User Avatar"
            className="profile-avatar"
            sx={{ width: 100, height: 100 }}
          />
        )}
        <Box marginTop={"10px"}>
          <div>Username: {userData.username}</div>
          <div>Email: {userData.email}</div>
          <div>Role: {userData.role}</div>
          {userData.role === "teacher" && (
            <div>
              Verified teacher:{" "}
              {userData.verified !== true ? "Not verified" : "Verified"}
            </div>
          )}
        </Box>
        <input type="file" onChange={handleFileChange} />
        <Box display="flex" flexDirection={"column"} alignItems={"center"}>
          {selectPhotoError && (
            <Box
              position={"absolute"}
              top={"50vh"}
              left={"5vw"}
              zIndex={"999"}
              sx={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid black",
                color: "red",
              }}
            >
              Please choose a photo first
            </Box>
          )}
          <Button
            sx={{ marginTop: "10px", width: "100%", alignContent: "center" }}
            onClick={handleSubmit}
          >
            Upload Avatar
          </Button>
          <Button
            onClick={() => navigate("/edit-profile")}
            sx={{ marginTop: "10px", width: "100%" }}
          >
            Edit profile
          </Button>
        </Box>
      </Box>
      <div className="avatar-upload-section">
        {userData.role === "teacher" && <VerifyTeacher userData={userData} />}
      </div>
      <div>
        <p>Notifications: </p>
        {userData.role === "student" &&
          (studentNotifications &&
          Object.keys(studentNotifications).length > 0 ? (
            Object.values(studentNotifications).map((notification) => {
              if (notification.seen === false)
                return (
                  <div key={notification.title}>
                    <p>Quiz Title: {notification.title}</p>
                    <p>Quiz Creator: {notification.username}</p>
                    <button onClick={() => handleAcceptQuiz(notification)}>
                      Accept
                    </button>
                    <button onClick={() => handleRejectQuiz(notification)}>
                      Reject
                    </button>
                  </div>
                );
            })
          ) : (
            <p>No notifications</p>
          ))}
        {userData.role === "teacher" &&
          (notifications && notifications.length > 0 ? (
            Object.values(notifications).map((notification) => {
              return (
                <div key={notification.groupId}>
                  <p>Group Name: {notification.groupName}</p>
                  <p>Group Creator: {notification.creator}</p>
                  <button
                    onClick={() => {
                      handleJoinGroup(notification.groupName);
                    }}
                  >
                    Join group
                  </button>
                  <button
                    onClick={() => {
                      handleRejectGroup(notification.groupName);
                    }}
                  >
                    Reject
                  </button>
                </div>
              );
            })
          ) : (
            <p>No notifications</p>
          ))}
      </div>
      <div>
        <UserGroups />
      </div>
    </Box>
  );
};
export default Profile;

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
  background-color: ${blue[700]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
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
