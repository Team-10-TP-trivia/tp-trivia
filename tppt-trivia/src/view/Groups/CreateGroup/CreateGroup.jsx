import { useContext, useState } from "react";
import { createGroup } from "../../../services/Groups/Groups-services";
import { AppContext } from "../../../context/appContext";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
    const { userData } = useContext(AppContext);
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const navigate = useNavigate();

    const handleCreateGroup = () => {
        if(!userData) return;
        if(!groupName || !groupDescription) return alert("Please fill in all fields");
        createGroup(userData.uid,userData.username,userData.firstName,userData.lastName, groupName, groupDescription, userData);
        navigate(-1)
    }

    return (
        <div>
            <h1>Create Group</h1>
            <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Group description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
            />
            <button onClick={handleCreateGroup}>Create</button>
        </div>
    );
}