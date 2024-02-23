import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/Authentication/auth-service";
import { createUserHandle, getUserByHandle } from "../../../services/UserServices/user-services";

export default function StudentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const {role} = location.state || {}
//   console.log(`Role on load:`, role)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [userExists, setUserExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [noCredentials, setNoCredentials] = useState(false);

  const updateForm = (prop) => (event) => {
    setForm({ 
        ...form, 
        [prop]: event.target.value });
  }

  const register = async () => {
    // console.log('Role on register: ', role)
    if (!form.email || !form.password || !form.phoneNumber || !form.username) {
        setNoCredentials(true);
        return console.log("Please provide the requested details in order to sign up.");
      }
      try {
        const user = await getUserByHandle(form.username);
        if(user.exists()) {
          setUserExists(true);
          return console.log(`User with handle ${form.username} already exists. Please choose another username.`);
        }
        const credentials = await registerUser(form.email, form.password);
        navigate('/');
        await createUserHandle(form.username, credentials.user.uid, form.email, form.phoneNumber, role);
      } catch (error) {
        setEmailExists(true);
        console.log(error.message);
      }
  }

  return (
    <div className="student-register-container">
      <h1>Student Registration</h1>
      <div className="student-register-form">
        <label htmlFor="username">Username</label>
        <input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" placeholder="Enter username" />
        
        <label htmlFor="email">Email</label>
        <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" placeholder="Enter email" />
        
        <label htmlFor="phoneNumber">Phone Number</label>
        <input value={form.phoneNumber} onChange={updateForm('phoneNumber')} type="tel" name="phoneNumber" id="phone-number" placeholder="Enter phone number" />
        
        <label htmlFor="password">Password</label>
        <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" placeholder="Enter password" />
        
        {userExists && <p className="error">User with that username already exists. Please choose another username.</p>}
        {emailExists && <p className="error">Email is already being used. Go to Login page or try another email.</p>}
        {noCredentials && <p className="error">Please provide all the requested details in order to sign up.</p>} 
        
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}