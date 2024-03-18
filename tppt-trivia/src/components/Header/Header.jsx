import { Link } from "react-router-dom";
import "./Header.css";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { Box } from "@mui/material";

export default function Header() {
  const { user, userData } = useContext(AppContext);

  if (!userData) {
    return (
      <>
        <div id="header-container">
          <h2>Welcome to the TP-Trivia App!</h2>
          <div>
            {user ? (
              <Link
                to={user ? "/create-trivia" : "/login"}
                className="header-container-buttons"
              >
                <p>➕</p>Create quiz
              </Link>
            ) : (
              ""
            )}

            <Link
              to={user ? "/join-room" : "/login"}
              className="header-container-buttons"
            >
              <p>🎮</p>
              Join quiz
            </Link>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {userData.blocked ? (
        <div className="blocked-user-message">
          <div id="header-container">
            <h2>Welcome to the TP-Trivia App!</h2>
            <div>
              {userData.role === "teacher" || userData.role === "admin" ? (
                <Link className="header-container-buttons">
                  <p>➕</p>Create quiz
                </Link>
              ) : (
                ""
              )}

              <Link className="header-container-buttons">
                <p>🎮</p>
                Join quiz
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div id="header-container">
          <h2>Welcome to the TP-Trivia App!</h2>
          <Box display={"flex"}>
            {userData.role === "teacher" || userData.role === "admin" ? (
              <Link
                to={user ? "/create-trivia" : "/login"}
                className="header-container-buttons"
              >
                <p>➕</p>Create quiz
              </Link>
            ) : (
              ""
            )}

            <Link
              to={user ? "/join-room" : "/login"}
              className="header-container-buttons"
            >
              <p>🎮</p>
              Join quiz
            </Link>
          </Box>
        </div>
      )}
    </>
  );
}
