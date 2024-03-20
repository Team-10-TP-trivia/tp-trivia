import PropTypes from "prop-types";
import { sendVerificationToAdmins } from "../../../services/AdminServices/admin-services";
import { useEffect, useState } from "react";
import {
  updateSentRequest,
  uploadVerificationFile,
} from "../../../services/UserServices/user-post-services";
import { getUserByHandle } from "../../../services/UserServices/user-services";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { Input, InputLabel, FormControl, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";

const StyledInput = styled("input")({
  display: "none",
  width: "100%",
});

const StyledLabel = styled("label")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const StyledIconButton = styled(IconButton)({
  margin: "8px",
});

export default function VerifyTeacher({ userData }) {
  const [schoolValue, setSchoolValue] = useState("");
  const [user, setUser] = useState(userData);
  const [noSchoolError, setNoSchoolError] = useState(false);
  const [photo, setPhoto] = useState(null);

  const outerTheme = useTheme();

  useEffect(() => {
    if (userData && userData.username) {
      getUserByHandle(userData.username, (userData) => {
        if (userData) {
          setUser(userData);
        }
      });
    }
  }, [userData]);

  const verifyTeacher = async () => {
    try {
      if (!schoolValue || schoolValue.length < 5) {
        setNoSchoolError(true);
        setTimeout(() => {
          setNoSchoolError(false);
        }, 2000);
        return;
      }

      const downloadUrl = await uploadVerificationFile(
        userData.username,
        photo
      );

      await sendVerificationToAdmins(
        userData.username,
        userData.email,
        userData.firstName,
        userData.lastName,
        schoolValue,
        downloadUrl
      );
      setSchoolValue("");
      await updateSentRequest(userData.username);
      setUser({ ...user, pendingVerification: true });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSchoolChange = (event) => {
    setSchoolValue(event.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div>
      {noSchoolError && (
        <Box display="flex" flexDirection={"column"} alignItems={"center"}>
          <Box
            position={"absolute"}
            top={"50vh"}
            left={"5vw"}
            zIndex={"999"}
            sx={{
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid black",
              color: "red",
            }}
          >
            Please enter a school name
          </Box>
        </Box>
      )}
      {user.pendingVerification ===
        false(
          <>
            <Typography variant="h6">Verify that you are a teacher</Typography>
            <label htmlFor="school">Enter a school where you teach</label>
            <br />
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextField
                label="School name"
                variant="filled"
                type="text"
                id="school"
                name="school"
                placeholder="School name"
                value={schoolValue}
                onChange={handleSchoolChange}
              />
            </ThemeProvider>
            <br />
            <label htmlFor="certificate">
              Provide certificate for education{" "}
            </label>
            <br />
            <StyledLabel htmlFor="contained-button-file1">
              <StyledInput
                accept="image/*"
                id="contained-button-file1"
                multiple
                type="file"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()}
              />
              <FormControl fullWidth>
                <InputLabel htmlFor="contained-button-file1">Upload</InputLabel>
                <Input
                  id="contained-button-file1"
                  value={photo ? photo.name : ""}
                  readOnly
                  endAdornment={
                    <StyledIconButton
                      aria-label="upload picture"
                      component="span"
                    >
                      <CloudUploadIcon />
                    </StyledIconButton>
                  }
                />
              </FormControl>
            </StyledLabel>
            <Button onClick={verifyTeacher}>Send verification</Button>
          </>
        )}
      {user.pendingVerification === "denied" && (
        <>
          <Typography variant="h6">Your verification were denied</Typography>
          <Typography variant="h6">Verify that you are a teacher</Typography>
          <label htmlFor="school">Enter a school where you teach</label>
          <br />
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              label="School name"
              variant="filled"
              type="text"
              id="school"
              name="school"
              placeholder="School name"
              value={schoolValue}
              onChange={handleSchoolChange}
            />
          </ThemeProvider>
          <br />
          <label htmlFor="certificate">
            Provide certificate for education{" "}
          </label>
          <br />
          <StyledLabel htmlFor="contained-button-file1">
            <StyledInput
              accept="image/*"
              id="contained-button-file1"
              multiple
              type="file"
              onChange={handleFileChange}
              onClick={(e) => e.stopPropagation()}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="contained-button-file1">Upload</InputLabel>
              <Input
                id="contained-button-file1"
                value={photo ? photo.name : ""}
                readOnly
                endAdornment={
                  <StyledIconButton
                    aria-label="upload picture"
                    component="span"
                  >
                    <CloudUploadIcon />
                  </StyledIconButton>
                }
              />
            </FormControl>
          </StyledLabel>
          <Button onClick={verifyTeacher}>Send verification</Button>
        </>
      )}
      {user.pendingVerification === "approved" && (
        <Typography variant="h6">Your were approved</Typography>
      )}
    </div>
  );
}

VerifyTeacher.propTypes = {
  userData: PropTypes.object,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const Button = styled("button")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: #FF9F45;;
    padding: 5px;
    border-radius: 5px;
    width: 150px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: 1px solid #e57914;
    box-shadow: 0 2px 1px ${
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.5)"
        : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px #e57914, inset 0 -2px 1px #e57914;
  
    &:hover {
      background-color: #91fd5e;
      color: black;
    }
  
    &:active {
      background-color: #91fd5e;
      box-shadow: none;
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
  
    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
      &:hover {
        background-color: ${blue[500]};
      }
    }
  `
);

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
    },
  });
