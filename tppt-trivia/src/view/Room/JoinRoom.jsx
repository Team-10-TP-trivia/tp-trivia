import { useEffect, useState } from "react";
import PrivateRooms from "./PrivateRoom/PrivateRooms";
import PublicRooms from "./PublicRoom/PublicRooms";
import UserQuizzes from "./UserQuizzes/UserQuizzes";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
export default function JoinRoom() {

    const [quizList, setQuizList] = useState([]);
    const [ loading , setLoading ] = useState(true);
    
    useEffect(() => {
        takeAllQuizzes().then((quizzes) => {
            setQuizList(quizzes);
            setLoading(false);
        });
    }, []);

    if(loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <PublicRooms quizList={quizList}/>
            <PrivateRooms quizList={quizList}/>
            <UserQuizzes quizList={quizList}/>
        </div>
    )
}