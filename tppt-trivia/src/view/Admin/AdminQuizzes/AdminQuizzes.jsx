import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import { deleteQuizById, takeAllQuizzes } from "../../../services/QuizService/Quizzes";
import { useNavigate } from "react-router-dom";

export default function AdminQuizzes() {
    const { userData } = useContext(AppContext);
    const [quizList, setQuizList] = useState([]);
    const [ loading , setLoading ] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        takeAllQuizzes().then((quizzes) => {
            setQuizList(quizzes);
            setLoading(false);
        });
    }, []);

    if(loading || !userData) {
        return <p>Loading...</p>
    }

    const editQuiz = (quiz) => {
        navigate(`/edit-quiz/${quiz.id}`, {state: {quiz}});
    }

    const deleteQuiz = (quiz) => {
        deleteQuizById(quiz.id);
        setQuizList(quizList.filter((prevQuiz) => prevQuiz.id !== quiz.id));
    }
    console.log(quizList.length);

    return (
        <div>
            <h1>Quizzes</h1>
            <ul>
                {quizList.map((quiz) => (
                    <div key={quiz.id}>
                    <h1>{quiz.title}</h1>
                    <h3>{quiz.description}</h3>
                    <button onClick={() => {editQuiz(quiz)}}>Edit quiz</button>
                    <button onClick={() => {deleteQuiz(quiz)}}>Delete quiz</button>
                    </div>
                ))}
            </ul>
        </div>
    )
}