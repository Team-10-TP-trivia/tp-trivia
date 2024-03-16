import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { getUserByHandle } from "../../services/UserServices/user-services";
import { isTeacherApproveChange } from "../../services/UserServices/user-post-services";

export default function RequestStatus() {

    const { userData } = useContext(AppContext);
    const [ user, setUser ] = useState(null);
    const [ showApprovedMessage, setShowApprovedMessage ] = useState(false);

    useEffect(() => {
  if (!userData) return;
  if (userData.role === "teacher") {
    getUserByHandle(userData.username, (userData) => {
      if (userData) {
        setUser(userData);
      }
    });
  }
}, [userData]);

    useEffect(() => {
        if(!userData || !user) return;
        if(userData.role === "teacher"){
        isTeacherApproveChange(user.username, (snapshot) => {
            setUser({...user, approved: snapshot});
            if (snapshot && !localStorage.getItem('messageShown')) {
                setShowApprovedMessage(true);
                localStorage.setItem('messageShown', 'true');
                setTimeout(() => setShowApprovedMessage(false), 2000);
            }
        });
    }}, [userData, user]);

    return (
        <div>
            {showApprovedMessage && <div>You have been approved</div>}
        </div>
    );
}