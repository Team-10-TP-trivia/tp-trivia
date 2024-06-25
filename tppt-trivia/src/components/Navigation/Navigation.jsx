// Navigation.jsx
import { useContext, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { AppContext } from "../../context/appContext";
import { logoutUser } from "../../services/Authentication/auth-service";
import { Avatar, Box, Menu, MenuItem } from "@mui/material";
import "./Navigation.css";
import SearchBar from "./Searchbar/SearchBar";
import logo from "../../assets/tplogo.png";
import NotificationContainer from "./Notifications/Notification";

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
  const [blockedUser, setBlockedUser] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const navigate = useNavigate();

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
    navigate("/home");
  };

  const clickProfile = () => {
    setProfileClicked(!profileClicked);
  };

  const goToGroups = () => {
    navigate("/groups");
  };

  const goToAdminPanel = () => {
    navigate("/admin");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div id="navigation-container">
      <div id="logo-search-bar">
        <NavLink to={"/home"} id="app-name">
          <img src={logo} alt="" />
        </NavLink>
        <SearchBar />
      </div>
      {user &&
        (userData.blocked ? (
          <div className="blocked-user-message">
            <div id="header-container">
              <div>
                {userData.role === "teacher" || userData.role === "admin" ? (
                  <Link className="user-options"></Link>
                ) : (
                  ""
                )}
                <Link className="user-options">Join quiz</Link>
              </div>
            </div>
          </div>
        ) : (
          <div id="header-container">
            <Box display={"flex"}>
              {userData.role === "teacher" || userData.role === "admin" ? (
                <Link
                  to={user ? "/create-trivia" : "/login"}
                  className="user-options"
                >
                  Create quiz
                </Link>
              ) : (
                ""
              )}

              <Link
                to={user ? "/join-quiz" : "/login"}
                className="user-options"
              >
                Browse quizzes
              </Link>
            </Box>
          </div>
        ))}
      <div>
        <nav
          className={user ? "navigation-with-user" : "navigation-without-user"}
        >
          {blockedUser ? (
            <div className="blocked-user-message">
              <p>
                Your account has been blocked. Please contact the administrator.
              </p>
            </div>
          ) : user ? (
            <>
              <div id="profile-navigation">
                <NotificationContainer />
                <Box
                  id="profile-link"
                  className={
                    user ? "navigation-with-user" : "navigation-without-user"
                  }
                  onClick={clickProfile}
                  sx={{ cursor: "pointer" }}
                >
                  <Avatar
                    src={userData.photoURL}
                    alt="User Avatar"
                    className="profile-avatar"
                    sx={{ width: "50px", height: "50px" }}
                  />

                  {profileClicked && (
                    <Menu
                      anchorEl={document.getElementById("profile-link")}
                      open={profileClicked}
                      onClose={clickProfile}
                    >
                      <MenuItem onClick={goToProfile}>Profile</MenuItem>
                      {teacher && (
                        <MenuItem onClick={goToGroups}>Groups</MenuItem>
                      )}
                      {admin && (
                        <MenuItem onClick={goToAdminPanel}>
                          Admin panel
                        </MenuItem>
                      )}
                      <MenuItem onClick={logOut}>Log Out</MenuItem>
                    </Menu>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <>
              <NavLink className={"login-register-buttons"} to="/login">
                Log in
              </NavLink>

              <NavLink className={"login-register-buttons"} to="/register">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
