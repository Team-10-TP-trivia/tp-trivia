import PropTypes from "prop-types";
import { sendVerificationToAdmins } from "../../../services/AdminServices/admin-services";
import { useEffect, useState } from "react";
import { updateSentRequest } from "../../../services/UserServices/user-post-services";
import { getUserByHandle } from "../../../services/UserServices/user-services";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

export default function VerifyTeacher({ userData }) {
    const [schoolValue, setSchoolValue] = useState("");
    const [user, setUser] = useState(userData);
    const [ noSchoolError, setNoSchoolError] = useState(false);

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
        if(!schoolValue || schoolValue.length < 5) {
            setNoSchoolError(true);
            setTimeout(() => {
                setNoSchoolError(false);
            }, 2000);
            return;
        }
        await sendVerificationToAdmins(userData.username, userData.email, userData.firstName,userData.lastName,schoolValue);
        setSchoolValue("");
        await updateSentRequest(userData.username);
        setUser({...user, pendingVerification: true});
    };
    
    const handleSchoolChange = (event) => {
        setSchoolValue(event.target.value);
    };

    return (
        <div>
            {noSchoolError && 
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
            }
            {user.pendingVerification === false && (
                <>
                    <h2>Verify that you are a teacher</h2>
                    <label htmlFor="school">Enter a school where you teach</label>
                    <br />
                    <input
                        type="text"
                        id="school"
                        name="school"
                        placeholder="School name"
                        value={schoolValue}
                        onChange={handleSchoolChange}
                    ></input>
                    <br />
                    <label htmlFor="certificate">
                        Provide certificate for education{" "}
                    </label>
                    <br />
                    <input type="file" id="certificate" name="certificate"></input>
                    <br />
                    <br />
                    <Button onClick={verifyTeacher}>Send verification</Button>
                </>
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
    background-color: ${blue[700]};
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: 1px solid ${blue[500]};
    box-shadow: 0 2px 1px ${
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.5)"
        : "rgba(45, 45, 60, 0.2)"
    }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};
  
    &:hover {
      background-color: ${blue[600]};
    }
  
    &:active {
      background-color: ${blue[700]};
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
