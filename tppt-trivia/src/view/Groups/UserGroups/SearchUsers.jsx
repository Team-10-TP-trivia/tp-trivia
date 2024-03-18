import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllUsers,
  sendUserInvitation,
} from "../../../services/UserServices/user-post-services";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function SearchUsers({ group }) {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [sentUserInvitations, setSentUserInvitations] = useState({});

  const outerTheme = useTheme();

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      const filteredUsers = allUsers.filter((user) =>
      {
        if(user.groupInvitations && user.groupInvitations[group.groupId]) {
        setSentUserInvitations(prevState => ({ ...prevState, [user.username]: 'pending' }));
        }
        return user.username.toLowerCase().includes(search.toLowerCase())
      }
      );
      setUsers(filteredUsers);
    });
  }, [search, group.groupId]);

  const sendInvitation = async (username, group) => {
    await sendUserInvitation(username, group);
    setSentUserInvitations(prevState => ({ ...prevState, [username]: 'pending' }));
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Typography variant="h6">Search for users</Typography>
      <ThemeProvider theme={customTheme(outerTheme)}>
        <TextField
          label="Search for users"
          variant="filled"
          type="text"
          id="school"
          name="school"
          placeholder="Find people by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </ThemeProvider>
      <br />
      {search !== "" &&
        users.map((user) => (
          <Box key={user.id} display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Avatar src={user.photoURL} alt="user photo" />
            <div>Username: {user.username}</div>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
            <button
              onClick={() => {
                sendInvitation(user.username, group);
              }}
            >
              {sentUserInvitations[user.username] === 'pending' ? 'Waiting' : 'Send Invitation'}
            </button>
          </Box>
        ))}
    </Box>
  );
}

SearchUsers.propTypes = {
  group: PropTypes.object,
};

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#91fd5e",
            "--TextField-brandBorderHoverColor": "#91fd5e",
            "--TextField-brandBorderFocusedColor": "#91fd5e",
            "& label.Mui-focused": {
              color: "#91fd5e",
              fontSize: "25px",
            },
            marginBottom: "10px",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            "&::before, &::after": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: "20px",
          },
        },
      },
    },
  });
