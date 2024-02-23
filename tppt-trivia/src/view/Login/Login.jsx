import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/Authentication/auth-service";
import { getUserData } from "../../services/UserServices/user-services";

/**
 * Login component.
 *
 * @component
 * @returns {JSX.Element} A component that displays a form for logging in. The form includes fields for the email and password of the user. It also includes options to handle login, display errors, and navigate to the home page after successful login.
 */
const Login = () => {
  const { user, userData, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [noCredentials, setNoCredentials] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  /**
   * Update form function.
   * 
   * @function
   * @param {string} prop - The property to update.
   * @returns {Function} - The function to handle the event.
   */
  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  useEffect(() => {
    /**
     * Redirect user if logged in.
     */
    if (user) {
      setTimeout(() => {
        navigate(location.state?.from.pathname || "/home");
      }, 1000);
    }
  }, [user, location, navigate]);

  useEffect(() => {
    /**
     * Set user logged in message.
     */
    if (userData) {
      setUserLoggedIn(
        `Welcome back, ${userData.firstName} ${userData.lastName}`
      );
    }
  }, [userData]);

  /**
   * Handle login.
   * 
   * @async
   * @function
   * @description This function handles the login process. It checks if the email and password fields are filled, and then logs in the user. If the login is successful, it navigates to the home page.
   */
  const login = async () => {
    if (!form.email && !form.password) {
      setNoCredentials(
        "Enter your email and password to log in. If you don't have an account, sign up for one."
      );
      setInvalidEmail(false);
      setInvalidPassword(false);
      return;
    }

    try {
      const credentials = await loginUser(form.email, form.password);
      if (credentials.user) {
        await getUserData(credentials.user.uid).then((snapshot) => {
          setContext({
            user: credentials.user,
            userData: snapshot.val()[Object.keys(snapshot.val())[0]],
          });
        });
      } else {
        setInvalidEmail("Invalid email");
        setInvalidPassword("Invalid password");
      }
      setNoCredentials("");
      setInvalidEmail(false);
      setInvalidPassword(false);
    } catch (error) {
      if (error.message.includes("email")) {
        setInvalidEmail("Invalid email");
        if(!form.password) setInvalidPassword("You should provide a password");
        setNoCredentials("");
      }
      else if (error.message.includes("password")) {
        setInvalidPassword("Invalid password");
        setNoCredentials("");
      }else {
        setNoCredentials("Incorrect email or password. Please try again.");
      }
    }
  };

  /**
   * Handle key press.
   * 
   * @function
   * @param {Object} e - The event object.
   * @description This function handles the key press event. If the key pressed is "Enter", it triggers the login function.
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <>
      {userLoggedIn && (
        <div id="successful-login">
          <p>{userLoggedIn}</p>
        </div>
      )}
      <div className="login-page">
        <div className="ring">
          <i style={{ "--clr": "#359381" }}></i>
          <i style={{ "--clr": "#813593" }}></i>
          <i style={{ "--clr": "#0078ff" }}></i>
          <div className="login">
            <h2>Login</h2>
            <div className="inputBoxes">
              <input
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={updateForm("email")}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="inputBoxes">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={updateForm("password")}
                onKeyDown={handleKeyPress}
              />
            </div>
            {invalidEmail && (
              <div id="loading-page-error">
                <p>{invalidEmail}</p>
              </div>
            )}
            {invalidPassword && (
              <div id="loading-page-error">
                <p>{invalidPassword}</p>
              </div>
            )}
            {noCredentials && (
              <div id="loading-page-error">
                <p>{noCredentials}</p>
              </div>
            )}
            <div className="inputBx">
              <input type="submit" value="Login" onClick={login} />
            </div>
            <div className="links"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
