import { useEffect, useState } from "react";
import { takeAllQuizzes } from "../../../services/QuizService/Quizzes";

export default function PrivateRooms() {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        takeAllQuizzes()
            .then(snapshot => {
                if (snapshot.exists()) {
                    const snapshotArray = Object.values(snapshot.val());
                    setQuizzes(snapshotArray);
                }
            })
    }, []);
    
    return (
        <div>
            <h1>Private Rooms</h1>
            {quizzes ? quizzes
                .filter((quiz) => quiz.visibility === 'private')
                .map((quiz) => {
                    return (
                        <div key={quiz.id}>
                            <p>Quiz Title: {quiz.title}</p>
                            <p>Quiz description: {quiz.description}</p>
                            <button>Join Quiz</button>
                        </div>
                    )
                })
                : <p>No quizzes available</p>}
        </div>
    )
}