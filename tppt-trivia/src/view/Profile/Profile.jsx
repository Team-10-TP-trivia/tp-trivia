import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import VerifyTeacher from "./VerifyTeacher/VerifyTeacher";
import { getUserByHandle } from "../../services/UserServices/user-services";
import {
  updateUserDetails,
  uploadProfilePicture,
} from "../../services/UserServices/user-post-services";
import { useNavigate } from "react-router-dom";
import UserGroups from "../Groups/UserGroups/UserGroups";
import { Avatar, Box } from '@mui/material';


const Profile = () => {
  const { userData } = useContext(AppContext);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.username) {
      getUserByHandle(userData.username).then((snapshot) => {
        if (snapshot.exists()) {
          setPhotoURL(snapshot.val().photoURL);
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
      // You can now use this URL to display the image or save it in your database
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  return (
    <Box display="flex" justifyContent={"space-around"}>
      <Box>
      {photoURL && (
        <Avatar src={photoURL} alt="User Avatar" className="profile-avatar" sx={{ width: 100, height: 100 }} />
      )}
      <div>Username: {userData.username}</div>
      <div>Email: {userData.email}</div>
      <div>Role: {userData.role}</div>
      {userData.role === "teacher" && <div>Verified teacher: {userData.verified.toString()}</div>}
      <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload Avatar</button>
      </Box>
      
      
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
