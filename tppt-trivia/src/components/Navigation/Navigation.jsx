// Navigation.jsx
import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { AppContext } from "../../context/appContext";
import { logoutUser } from "../../services/Authentication/auth-service";
import './Navigation.css'

/**
 * Component for the navigation bar of the webpage.
 *
 * @component
 * @returns {JSX.Element} A navigation bar component with different navigation links based on the user's status (logged in/out) and type (admin/regular user).
 */
export default function Navigation() {
  const { user, userData, setContext } = useContext(AppContext);
  const [admin, setAdmin] = useState(false);

  /**
   * Checks if the user is an admin when the component mounts or when userData changes.
   */
  useEffect(() => {
    if (userData && userData.type === "admin") {
      setAdmin(true);
    }
  }, [userData]);

   /**
   * Logs out the user.
   *
   * @async
   */
  const logOut = async () => {
    await logoutUser();
    setContext({ user: null, userData: null });
  };

  return (
    <div className="navigation-container">
      <nav className="navigation">
        <NavLink className="navigation-menu" to="/home">
          Home
        </NavLink>
        {user ? (
          <>
            <NavLink className="navigation-menu" to="/create-post">
              Create Post
            </NavLink>

            <NavLink className="navigation-menu" to="/all-posts">
              All Posts
            </NavLink>

            {admin && (
              <NavLink className="navigation-menu" to="/users">
                Users
              </NavLink>
            )}

            <NavLink className="navigation-menu" onClick={logOut} to="/">
              Log Out
            </NavLink>

            <NavLink
              to="/profile" 
              id="profile-link">
                {`${userData?.username}'s Profile`}</NavLink>
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
        )}
      </nav>
    </div>
  );
}
