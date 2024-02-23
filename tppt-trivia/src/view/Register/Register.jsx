import { useState } from "react";
import 'firebase/auth';
import { registerUser } from "../../services/Authentication/auth-service";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../../services/UserServices/user-services";

/**
 * Register component.
 *
 * @component
 * @returns {JSX.Element} A component that displays a form for user registration. The form includes fields for the first name, last name, username, email, and password of the user. It also includes options to handle registration, display errors, and navigate to the home page after successful registration.
 */
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [userExists, setUserExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [noCredentials, setNoCredentials] = useState(false);

  /**
   * Update form function.
   * 
   * @function
   * @param {string} prop - The property to update.
   * @returns {Function} - The function to handle the event.
   */
  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  }

  /**
   * Register function.
   * 
   * @async
   * @function
   * @description This function handles the registration process. It checks if the email and password fields are filled, if the username exists, and then registers the user. If the registration is successful, it navigates to the home page.
   */
  const register = async () => {

    if (!form.email || !form.password) {
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
      await createUserHandle(form.username, credentials.user.uid, form.email,form.firstName, form.lastName);
    } catch (error) {
      setEmailExists(true);
      console.log(error.message);
    }
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <h1>Register</h1>
      </div>
      <div className="register-form">
        <label htmlFor="firstName"></label><input value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" placeholder="Enter first name" />
        <label htmlFor="lastName"></label><input value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" placeholder="Enter last name" />
        <label htmlFor="username"></label><input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" placeholder="Enter username" />
        <label htmlFor="email"></label><input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" placeholder="Enter email" />
        <label htmlFor="password"></label><input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" placeholder="Enter password" />
        {userExists && <p>User with that username already exists. Please choose another username.</p>}
        {emailExists && <p>Email is already being used. Go to Login page or try another email.</p>}
        {noCredentials && <p>Please provide the requested details in order to sign up.</p>} 
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}