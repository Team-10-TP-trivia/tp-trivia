// Navigation.jsx
import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { AppContext } from "../../context/appContext";
import { logoutUser } from "../../services/Authentication/auth-service";
import { Avatar } from "@mui/material";
import "./Navigation.css";

/**
 * Component for the navigation bar of the webpage.
 *
 * @component
 * @returns {JSX.Element} A navigation bar component with different navigation links based on the user's status (logged in/out) and type (admin/regular user).
 */
export default function Navigation() {
  const { user, userData, setContext } = useContext(AppContext);
  const [admin, setAdmin] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [ blockedUser, setBlockedUser ] = useState(false);

  /**
   * Checks if the user is an admin when the component mounts or when userData changes.
   */
  useEffect(() => {
    if (userData && userData.role === "admin") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }

    if (userData && userData.role === "teacher") {
      setTeacher(true);
    } else {
      setTeacher(false);
    }

    if (userData && userData.blocked) {
      setBlockedUser(true);
    }
  }, [userData]);

  /**
   * Logs out the user.
   *
   * @async
   */
  const logOut = () => {
    logoutUser();
    setContext({ user: null, userData: null });
  };

  return (
    <div className="navigation-container">
      <nav
        className={user ? "navigation-with-user" : "navigation-without-user"}
      >
        
        {blockedUser ? (
          <div className="blocked-user-message">
            <p>Your account has been blocked. Please contact the administrator.</p>
          </div>
        ) : (
          user ? (
            <>
              {admin && (
                <NavLink className="navigation-menu" to="/admin">
                  Admin&apos;s panel
                </NavLink>
              )}
              {teacher && (
                <NavLink className="navigation-menu" to="/groups">
                  Groups
                </NavLink>
              )}
  
              <NavLink className="navigation-menu" onClick={logOut} to="/">
                Log Out
              </NavLink>
  
              <NavLink
                to="/profile"
                id="profile-link"
                className="navigation-menu"
              >
                <Avatar
                  src={userData.photoURL}
                  alt="User Avatar"
                  className="profile-avatar"
                  sx={{ width: 25, height: 25 }}
                />
                <span>{`${userData?.username}'s Profile`}</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className="navigation-menu" to="/login">
                Login
              </NavLink>
  
              <NavLink className="navigation-menu" to="/register">
                Register
              </NavLink>
            </>
          )
        )}
        <NavLink className="navigation-menu" to="/home">
          Home
        </NavLink>
        
      </nav>
    </div>
  );
}
