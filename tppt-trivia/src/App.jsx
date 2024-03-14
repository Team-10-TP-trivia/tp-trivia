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
import AdminPanel from './view/Admin/AdminPanel/AdminPanel';
import CreateTrivia from './components/CreateTrivia/CreateTrivia';
import EditProfile from './view/Profile/EditProfile/EditProfile';
import JoinRoom from './view/Room/JoinRoom';
import Groups from './view/Groups/Groups';
import CreateGroup from './view/Groups/CreateGroup/CreateGroup';
import EditQuiz from './components/EditQuiz/EditQuiz';
import Sports from './view/Categories/Sports/Sports';
import Science from './view/Categories/Science/Science';
import Math from './view/Categories/Math/Math';
import GeneralKnowledge from './view/Categories/GeneralKnowledge/GeneralKnowledge';
import OpenUserGroup from './view/Groups/UserGroups/OpenUserGroup';
import Quiz from './view/Room/Quiz/Quiz';
import UserOverview from './view/Room/Quiz/UserOverview';
import { PrivateQuizPinCode } from './view/Room/PrivateRoom/PrivateQuizPinCode';

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
            <Route path="/student-registration" element={<StudentDetails />} />
            <Route path="/teacher-registration" element={<TeacherDetails />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-trivia' element={<CreateTrivia />} />
            <Route path='/admin' element={<AdminPanel />} />
            <Route path='/edit-profile' element={<EditProfile />} />
            <Route path='/join-room' element={<JoinRoom />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/groups/create-group/:userId' element={<CreateGroup />} />
            <Route path='/edit-quiz/:userId' element={<EditQuiz />} />
            <Route path="/sports" element={<Sports />} />
            <Route path='/science' element={<Science />} />
            <Route path='/math' element={<Math />} />
            <Route path='/general-knowledge' element={<GeneralKnowledge />} />
            <Route path='/profile/group/:groupId' element={<OpenUserGroup />} />
            <Route path='/quiz/:quizId' element={<Quiz />} />
            <Route path='/quiz/:quizId/enter-code' element={<PrivateQuizPinCode />} />
            <Route path='/quiz/:quizId/:username/overview' element={<UserOverview />} />
          </Routes>
        </Layout>          
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;