import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [, setRole] = useState(null);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    navigate(`/${selectedRole}-registration`, { state: { role: selectedRole } });
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1>Register as:</h1>
      </div>
      <div className="role-selection">
        <button onClick={() => handleRoleSelection('student')} className="role-button student">Student</button>
        <button onClick={() => handleRoleSelection('teacher')} className="role-button teacher">Teacher</button>
      </div>
    </div>
  );
}