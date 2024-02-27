import { useEffect, useState } from "react";
import PrivateRooms from "./PrivateRoom/PrivateRooms";
import PublicRooms from "./PublicRoom/PublicRooms";
import UserQuizzes from "./UserQuizzes/UserQuizzes";
import { listenForQuizzesChange, takeAllQuizzes } from "../../services/QuizService/Quizzes";

export default function JoinRoom() {

    const [ quizList, setQuizList ] = useState([]);
    useEffect(() => {
        takeAllQuizzes().then((snapshot) => {
            setQuizList(snapshot);
          });
    }, [quizList]);

    useEffect(() => {
        // Subscribe to changes in the quiz list
        const unsubscribe = listenForQuizzesChange((quizzes) => {
          setQuizList(quizzes);
        });
    
        // Cleanup function to unsubscribe when component unmounts or if necessary
        return () => {
          unsubscribe();
        };
      }, []);

    return (
        <div>
            <PublicRooms quizList={quizList}/>
            <PrivateRooms quizList={quizList}/>
            <UserQuizzes quizList={quizList}/>
        </div>
    )
}