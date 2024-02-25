import PropTypes from "prop-types";
import { sendVerificationToAdmins } from "../../../services/AdminServices/admin-services";
import { useEffect, useState } from "react";
import { updateSentRequest } from "../../../services/UserServices/user-post-services";
import { getUserByHandle } from "../../../services/UserServices/user-services";

export default function VerifyTeacher({ userData }) {
    const [schoolValue, setSchoolValue] = useState("");
    const [user, setUser] = useState(userData);
    useEffect(() => {
        if(userData && userData.username){
            getUserByHandle(userData.username).then((snapshot) => {
                if (snapshot.exists()) {
                    setUser(snapshot.val());
                }
            });
        }
    }, [userData]);
    
    const verifyTeacher = async () => {
        if(!schoolValue || schoolValue.length < 5) return alert("Please enter a school name");
        await sendVerificationToAdmins(userData.username, schoolValue);
        setSchoolValue("");
        updateSentRequest(userData.username);
    };
    
    const handleSchoolChange = (event) => {
        setSchoolValue(event.target.value);
    };

    return (
        <div>
            {user.pendingVerification && <h2>Pending approval</h2>}
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
                    <button onClick={verifyTeacher}>Send verification</button>
                </>
            )}
        </div>
    );
}

VerifyTeacher.propTypes = {
    userData: PropTypes.object,
};
