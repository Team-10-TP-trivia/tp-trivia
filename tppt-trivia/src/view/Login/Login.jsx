import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/Authentication/auth-service";
import { getUserData } from "../../services/UserServices/user-services";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

  const defaultTheme = createTheme();

  const navigateToSignUp = () => {
    navigate("/student-registration");
  };

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
      setTimeout(() => {
        setNoCredentials(false);
      }, 3000);
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
        if (!form.password) setInvalidPassword("You should provide a password");
        setNoCredentials("");
      } else if (error.message.includes("password")) {
        setInvalidPassword("Invalid password");
        setNoCredentials("");
      } else {
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
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <TextField
                  value={form.email}
                  onChange={updateForm("email")}
                  onKeyDown={handleKeyPress}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={form.password}
                  onChange={updateForm("password")}
                  onKeyDown={handleKeyPress}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={login}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={navigateToSignUp} variant="body2">
                    Don&apos;t have an account? Sign up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
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
    </>
  );
};

export default Login;
