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
import { userRejectQuiz } from "../../services/QuizService/Quizzes";
import { userAcceptedQuiz } from "../../services/TeacherServices/teacher-services";

const Profile = () => {
  const { userData } = useContext(AppContext);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);

  useEffect(() => {
    if (userData && userData.username) {
      getUserByHandle(userData.username, (userData) => {
        if (userData) {
          setPhotoURL(userData.photoURL);
          if (userData.groupInvitations) {
            setNotifications(Object.values(userData.groupInvitations));
          }
          if (userData.quizInvitations) {
            setStudentNotifications(userData.quizInvitations);
          }
        }
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
      console.error("Error uploading the file", error);
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
    <Box display="flex" justifyContent={"space-around"}>
      <Box>
        {photoURL && (
          <Avatar
            src={photoURL}
            alt="User Avatar"
            className="profile-avatar"
            sx={{ width: 100, height: 100 }}
          />
        )}
        <div>Username: {userData.username}</div>
        <div>Email: {userData.email}</div>
        <div>Role: {userData.role}</div>
        {userData.role === "teacher" && (
          <div>Verified teacher: {userData.verified.toString()}</div>
        )}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload Avatar</button>
      </Box>
      <div>
        <p>Notifications: </p>
        {userData.role === "student" &&
          (studentNotifications && Object.keys(studentNotifications).length > 0 ? (
            Object.values(studentNotifications).map((notification) => {
              if(notification.seen === false)
              return (
                <div key={notification.title}>
                  <p>Quiz Title: {notification.title}</p>
                  <p>Quiz Creator: {notification.username}</p>
                  <button onClick={() => handleAcceptQuiz(notification)}>Accept</button>
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
              console.log(notification)
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
      <div className="avatar-upload-section">
        {userData.role === "teacher" && <VerifyTeacher userData={userData} />}
      </div>
      <div>
        <button onClick={() => navigate("/edit-profile")}>Edit profile</button>
        <UserGroups />
      </div>
    </Box>
  );
};
export default Profile;
