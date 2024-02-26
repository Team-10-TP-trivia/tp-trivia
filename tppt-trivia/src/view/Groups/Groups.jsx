import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import AllGroups from "./AllGroups/AllGroups";

export default function Groups() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate(`create-group/${userData.uid}`)}>Create group</button>
            <AllGroups />
        </div>
    );
}