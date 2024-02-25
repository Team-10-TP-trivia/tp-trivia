import { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import './App.css'
import Home from './view/Home/Home';
import Login from './view/Login/Login';
import Register from './view/Register/Register';
import { getUserData } from './services/UserServices/user-services';
import Layout from './hoc/Layout';
import StudentDetails from './view/Register/Student/StudentDetails';
import TeacherDetails from './view/Register/Teacher/TeacherDetails';
import { AppContext } from './context/appContext';
import Profile from './view/Profile/Profile';
import CreateTrivia from './components/CreateTrivia/CreateTrivia';

function App() {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  });
  const [user] = useAuthState(auth);
  //     ☝️, loading, error - if we use them, we can show a loading spinner or an error message

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {
            setContext({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
      }
  }, [user]);
  
  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...context, setContext }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student" element={<StudentDetails />} />
            <Route path="/teacher" element={<TeacherDetails />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-trivia' element={<CreateTrivia />} />
          </Routes>
        </Layout>          
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;