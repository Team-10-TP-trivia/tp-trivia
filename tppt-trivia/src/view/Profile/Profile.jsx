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
import Typography from "@mui/material/Typography";
import { Input, InputLabel, FormControl, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StyledInput = styled("input")({
  display: "none",
  width: "100%",
});

const StyledLabel = styled("label")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const StyledIconButton = styled(IconButton)({
  margin: "8px",
});

const Profile = () => {
  const { userData } = useContext(AppContext);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [userError, setUserError] = useState(false);
  const [selectPhotoError, setSelectPhotoError] = useState(false);
  const [acceptedNotification, setAcceptedNotification] = useState(false);
  

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
    navigate(`/group/${groupName}`);
  };

  const handleRejectGroup = (groupName) => {
    userRejectRequest(groupName, userData.username);
    setAcceptedNotification(!acceptedNotification);
  };

  const handleAcceptQuiz = (quiz) => {
    userAcceptedQuiz(userData.username, quiz.quizId);
    if(quiz.visibility === "public"){
      navigate(`/quiz/${quiz.quizId}`);
    }
    if(quiz.visibility === "private"){
      navigate(`/quiz/${quiz.quizId}/enter-code`);
    }
  };

  
  const handleRejectQuiz = (quiz) => {
    userRejectQuiz(userData.username, quiz);
  };

  return (
    <Box
      display="flex"
      justifyContent={"space-between"}
      marginTop={"20px"}
      sx={{
        backgroundColor: "charcoal",
        margin: "0 auto",
        width: "90%",
        minHeight: "80vh",
      }}
    >
      {userError && (
        <Box
          position={"absolute"}
          top={"0"}
          zIndex={"999"}
          sx={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid black",
            color: "red",
          }}
        >
          {userError}
        </Box>
      )}
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
          minHeight: "300px",
          width: "20%",
        }}
      >
        {photoURL && (
          <Avatar
            src={photoURL}
            alt="User Avatar"
            className="profile-avatar"
            sx={{ width: 100, height: 100 }}
          />
        )}
        <Box marginTop={"10px"}>
          <Typography variant="h6">Username: {userData.username}</Typography>
          <Typography variant="h6">Email: {userData.email}</Typography>
          <Typography variant="h6">Role: {userData.role}</Typography>
          {userData.role === "teacher" && (
            <Typography variant="h6">
              Verified teacher:{" "}
              {userData.verified !== true ? "Not verified" : "Verified"}
            </Typography>
          )}
        </Box>
        <StyledLabel htmlFor="contained-button-file2">
          <StyledInput
            accept="image/*"
            id="contained-button-file2"
            multiple
            type="file"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="contained-button-file2">Upload</InputLabel>
            <Input
              id="contained-button-file2"
              value={photo ? photo.name : ""}
              readOnly
              endAdornment={
                <StyledIconButton aria-label="upload picture" component="span">
                  <CloudUploadIcon />
                </StyledIconButton>
              }
            />
          </FormControl>
        </StyledLabel>
        <Box display="flex" flexDirection={"column"} alignItems={"center"}>
          {selectPhotoError && (
            <Box
              position={"absolute"}
              top={"55vh"}
              left={"8vw"}
              zIndex={"999"}
              sx={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid black",
                color: "red",
              }}
            >
              <Typography variant="p">Please choose a photo first</Typography>
            </Box>
          )}
          <Buttons
            sx={{ marginTop: "10px", width: "100%", alignContent: "center" }}
            onClick={handleSubmit}
          >
            Upload Avatar
          </Buttons>
          <Buttons
            onClick={() => navigate("/edit-profile")}
            sx={{ marginTop: "10px", width: "100%" }}
          >
            Edit profile
          </Buttons>
        </Box>
      </Box>
      {userData.role === "teacher" && (
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
            minHeight: "300px",
            width: "20%",
          }}
        >
          <VerifyTeacher userData={userData} />
        </Box>
      )}

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
          minHeight: "300px",
          width: "20%",
        }}
      >
        <Typography variant="h6">Notifications:</Typography>
        {userData.role === "student" &&
          (studentNotifications &&
          Object.keys(studentNotifications).length > 0 ? (
            Object.values(studentNotifications).map((notification) => {
              if (notification.seen === false)
                return (
                  <div key={notification.title}>
                    <Typography variant="p">
                      Quiz Title: {notification.title}
                    </Typography>
                    <Typography variant="p">
                      Quiz Creator: {notification.username}
                    </Typography>
                    <Buttons onClick={() => handleAcceptQuiz(notification)}>
                      Accept
                    </Buttons>
                    <Buttons onClick={() => handleRejectQuiz(notification)}>
                      Reject
                    </Buttons>
                  </div>
                );
            })
          ) : (
            <Typography variant="p">No notifications!</Typography>
          ))}
        {userData.role === "teacher" &&
          (notifications && notifications.length > 0 ? (
            Object.values(notifications).map((notification) => {
              if(notification.status === "pending") {
                return (
                  <Box key={notification.groupId}>
                    <Typography variant="p">
                      Group Name: {notification.groupName} <br /> <br />
                    </Typography>
                    <Typography variant="p">
                      Group Creator: {notification.creator} <br /> 
                    </Typography>
                    <Buttons
                      onClick={() => {
                        handleJoinGroup(notification.groupName)
                      }}
                    >
                      Join group
                    </Buttons>
                    <Buttons
                      onClick={() => {
                        handleRejectGroup(notification.groupName);
                      }}
                    >
                      Reject
                    </Buttons>
                  </Box>
                );
              }
              if(notification.status !== "pending") {
                return (
                  <div key={'Empty'}>No new Notifications!</div>
                )
              }
            })
          ) : (
            <Typography variant="p">No notifications!</Typography>
          ))}
      </Box>
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
          minHeight: "300px",
          width: "20%",
        }}
      >
        <UserGroups />
      </Box>
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

const Buttons = styled("button")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: #FF9F45;;
    padding: 5px;
    border-radius: 5px;
    width: fit-content;
    min-width: 100px;
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
