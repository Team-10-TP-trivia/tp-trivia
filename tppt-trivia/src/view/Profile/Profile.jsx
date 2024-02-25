import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import VerifyTeacher from "./VerifyTeacher/VerifyTeacher";

const Profile = () => {
  const { userData } = useContext(AppContext);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div>Username: {userData.username}</div>
    <div>Email: {userData.email}</div>
    <div>Role: {userData.role}</div>
    <div>Verified teacher: {userData.verified.toString()}</div>
    {userData.role === 'teacher' && (
      <VerifyTeacher userData={userData}/>
    )}
    </>
  )
  }
export default Profile;
