import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { useNavigate } from "react-router-dom";
import { updateUserDetails } from "../../../services/UserServices/user-post-services";
import "./EditProfile.css";
/**
 * Component for editing a user's profile.
 *
 * @component
 * @returns {JSX.Element} A component that displays a form for editing a user's profile. The form includes fields for the user's first name, last name, and email. It also includes options to save the changes or go back to the profile page.
 */
const EditProfile = () => {
  const { userData, setContext } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();
  const [updateError, setUpdateError] = useState(false);  
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (userData) {
      setUserInfo({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      await updateUserDetails(userData.username, userInfo);
      setContext(prev => ({
        ...prev,
        userData: { ...prev.userData, ...userInfo },
      }));
      setUpdateSuccess(true);
      navigate('/profile');
    } catch (error) {
      setUpdateError(true);
    }
  };

  const goBack = () => {
    navigate('/profile')
  }

  return (
    <div className="edit-profile-all">
      <div className="edit-profile-container">
        <h1>Edit Profile</h1>
          <input name="firstName" value={userInfo.firstName} onChange={handleInputChange} placeholder="First Name" />
          <input name="lastName" value={userInfo.lastName} onChange={handleInputChange} placeholder="Last Name" />
          <input name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email" />
          {updateError && <p>Failed to update profile.</p>}
          {updateSuccess && <p>Profile updated successfully!</p>}
        <button onClick={saveChanges}>Save Changes</button>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};

export default EditProfile;
