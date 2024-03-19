import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import AllGroups from "./AllGroups/AllGroups";
import Box from "@mui/material/Box";

export default function Groups() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <button style={{width: "100px", height: "50px", margin: "10px"}}
            onClick={() => navigate(`create-group/${userData.uid}`)}>Create group</button>
            <AllGroups />
        </Box>
    );
}