import { Link } from "react-router-dom";
import "./Header.css";
import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import HeaderSlider from "./HeaderSlider/HeaderSlider";

export default function Header() {
  const { user, userData } = useContext(AppContext);
  const [blockedPopup, setBlockedPopup] = useState(false);

  const blockedMessage = () => {
    setBlockedPopup(true);

    setTimeout(() => {
      setBlockedPopup(false);
    }, 1500);
  };

  if (!userData) {
    return (
      <>
        <div id="header-container">
          <h2>Welcome to the TP-Trivia App!</h2>
          <HeaderSlider />

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
      </>
    );
  }
  return (
    <>
      {blockedPopup === true && (
        <div className="blocked-popup">
          <p>
            Your are blocked from creating or joining a quiz. 
          </p>
        </div>
      )}
      {userData.blocked ? (
        <div className="blocked-user-message">
          <div id="header-container">
            <h2>Welcome to the TP-Trivia App!</h2>
            <HeaderSlider />

            {userData.role === "teacher" || userData.role === "admin" ? (
              <Link
                onClick={() => blockedMessage()}
                className="header-container-buttons"
              >
                <p>➕</p>Create quiz
              </Link>
            ) : (
              ""
            )}

            <Link
              onClick={() => blockedMessage()}
              className="header-container-buttons"
            >
              <p>🎮</p>
              Join quiz
            </Link>
          </div>
        </div>
      ) : (
        <div id="header-container">
          <h2>Welcome to the TP-Trivia App!</h2>
          <HeaderSlider />

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
        </div>
      )}
    </>
  );
}
