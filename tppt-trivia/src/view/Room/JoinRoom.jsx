import { useContext, useEffect, useState } from "react";
import PrivateRooms from "./PrivateRoom/PrivateRooms";
import PublicRooms from "./PublicRoom/PublicRooms";
import UserQuizzes from "./UserQuizzes/UserQuizzes";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
import { AppContext } from "../../context/appContext";
export default function JoinRoom() {
    const { userData } = useContext(AppContext);
    const [quizList, setQuizList] = useState([]);
    const [ loading , setLoading ] = useState(true);
    
    useEffect(() => {
        takeAllQuizzes().then((quizzes) => {
            setQuizList(quizzes);
            setLoading(false);
        });
    }, []);

    if(loading || !userData) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <PublicRooms quizList={quizList}/>
            <PrivateRooms quizList={quizList}/>
            {(userData.role === 'teacher' || userData.role === 'admin') && <UserQuizzes quizList={quizList}/>}
        </div>
    )
}