import { useContext } from "react";
import { AppContext } from "../../context/appContext";

const Profile = () => {
  const { userData } = useContext(AppContext);


  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <h1>Hello</h1>
    </>
  )
  }
export default Profile;
