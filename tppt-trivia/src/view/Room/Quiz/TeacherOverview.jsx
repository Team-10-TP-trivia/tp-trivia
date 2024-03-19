import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  findStudents,
  sendQuizInvitation,
} from "../../../services/TeacherServices/teacher-services";
import { getAllUsers } from "../../../services/AdminServices/admin-services";
import { AppContext } from "../../../context/appContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";

export default function TeacherOverview({ quiz, quizId, participants }) {
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [invitationSent, setInvitationSent] = useState(false);

  const outerTheme = useTheme();

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    const f = async () => {
      const unsubscribe = await getAllUsers(setUsers);
      return () => unsubscribe();
    };
    // if(userData && userData.role === "teacher") {
    // const unsubscribe = getAllUsers(setUsers);
    // return () => unsubscribe();
    // }
    f();
  }, [userData]);

  useEffect(() => {
    findStudents(search).then((snapshot) => {
      setStudents(snapshot);
    });
  }, [search]);

  const sendInvite = (studentName) => {
    setInvitationSent(true);

    sendQuizInvitation(studentName, quiz, quizId);

    setTimeout(() => {
      setInvitationSent(false);
    }, 2000);
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <Typography variant="h4">Teacher Overview</Typography>
      <Typography variant="h5">Quiz {quiz.title} overview</Typography>
      <ThemeProvider theme={customTheme(outerTheme)}>
        <TextField
          label="Search users"
          variant="filled"
          type="text"
          id="school"
          name="school"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </ThemeProvider>
      <Box
        id="teacher-overview"
        display={"flex"}
        sx={{
          width: "100%",
          padding: "10px",
          gap: "20px",
          minHeight: "80vh",
          height: "fit-content",
        }}
      >
        <Box display={"flex"} gap={"20px"}>
          {students &&
            students.map((student) => {
              return (
                <Box key={student.uid} display={"flex"} flexDirection={"column"}
                  sx={{
                    height: "fit-content",
                    minHeight: "200px",
                  }}
                >
                  {student.photoURL && (
                    <Avatar src={student.photoURL} alt="user photo" />
                  )}
                  <Typography variant="h6">
                    First Name: {student.firstName}
                  </Typography>
                  <Typography variant="h6">
                    Last Name: {student.lastName}
                  </Typography>
                  <Typography variant="h6">Email: {student.email}</Typography>
                  <button onClick={() => sendInvite(student.username)}>
                    Send Invite for quiz
                  </button>
                </Box>
              );
            })}
          {invitationSent && <p>Invitation sent!</p>}
        </Box>
        <Box id="students-results">
          <Typography variant="h6">
            Participants: {participants ? Object.keys(participants).length : 0}
          </Typography>
          {users && (
            <Box display={"flex"}>
              {users.map((user) => {
                if (user.takenQuizzes && user.takenQuizzes[quizId]) {
                  return (
                    <Box
                      key={user.uid}
                      display={"flex"}
                      flexDirection={"column"}
                      sx={{
                        border: "2px solid #91fd5e",
                        borderRadius: "10px",
                        padding: "10px",
                        boxShadow: "0 0 10px #91fd5e",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          boxShadow: "0 0 10px #91fd5e",
                          transform: "scale(1.1)",
                          backgroundColor: "rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Typography variant="h6">
                        Student: {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="p">
                        Right answers: {user.takenQuizzes[quizId].rightAnswers}{" "}
                        out of {user.takenQuizzes[quizId].questionLength}
                      </Typography>
                      <Typography variant="p">
                        Points:{" "}
                        {user.takenQuizzes[quizId]
                          ? user.takenQuizzes[quizId].receivedPoints
                          : 0}{" "}
                        out of {user.takenQuizzes[quizId].quizPoints}
                      </Typography>
                    </Box>
                  );
                }
              })}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

TeacherOverview.propTypes = {
  quiz: PropTypes.object,
  quizId: PropTypes.string,
  participants: PropTypes.object,
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
            width: "50%",
          },
        },
      },
    },
  });
