import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/Authentication/auth-service";
import {
  createUserHandle,
  getUserByHandle,
} from "../../../services/UserServices/user-services";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function StudentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [userExists, setUserExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [noCredentials, setNoCredentials] = useState(false);

  const defaultTheme = createTheme();

  const navigateToSignIn = () => {
    navigate("/login");
  };

  const updateForm = (prop) => (event) => {
    setForm({
      ...form,
      [prop]: event.target.value,
    });
  };

  const register = async () => {
    if (
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.password ||
      !form.phoneNumber ||
      !form.username
    ) {
      setNoCredentials(true);
      return console.log(
        "Please provide the requested details in order to sign up."
      );
    }
    try {
      const user = getUserByHandle(form.username);
      if (user.exists()) {
        setUserExists(true);
        return console.log(
          `User with handle ${form.username} already exists. Please choose another username.`
        );
      }
      const credentials = registerUser(form.email, form.password);
      navigate("/");
      createUserHandle(
        form.username,
        form.firstName,
        form.lastName,
        credentials.user.uid,
        form.email,
        form.phoneNumber,
        role
      );
    } catch (error) {
      setEmailExists(true);
      console.log(error.message);
    }
  };

  return (
    <>
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    value={form.firstName}
                    onChange={updateForm("firstName")}
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    value={form.lastName}
                    onChange={updateForm("lastName")}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={form.username}
                    onChange={updateForm("username")}
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={form.phoneNumber}
                    onChange={updateForm("phoneNumber")}
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    autoComplete="phoneNumber"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={form.email}
                    onChange={updateForm("email")}
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
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={register}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={navigateToSignIn} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      {userExists && (
        <p className="error">
          User with that username already exists. Please choose another
          username.
        </p>
      )}
      {emailExists && (
        <p className="error">
          Email is already being used. Go to Login page or try another email.
        </p>
      )}
      {noCredentials && (
        <p className="error">
          Please provide all the requested details in order to sign up.
        </p>
      )}
    </>
  );
}
