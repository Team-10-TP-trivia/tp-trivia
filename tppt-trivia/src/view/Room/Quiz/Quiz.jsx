import { useEffect, useState } from "react";
import { getQuizById } from "../../../services/QuizService/Quizzes";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

export default function Quiz() {
  const { quizId } = useParams();
  const [ quiz, setQuiz ] = useState(null);
  const [ quizQuestions, setQuizQuestions ] = useState([]);
  const [ answers , setAnswers ] = useState([]);
  const [ participants, setParticipants ] = useState(null);
  
  useEffect(() => {
    if(!quizId) return;
    getQuizById(quizId).then((snapshot) => {
      setQuiz(snapshot);
      setQuizQuestions(snapshot.questions);
      setAnswers(snapshot.questions.map((questionId) => {
        return Object.values(questionId.answers)
      }));
      setParticipants(snapshot.participants);
    });
  }, [quizId]);

  return (
    <div>
      {quiz ? (
        <div>
          <h1>Quiz Title: {quiz.title}</h1>
          <h2>Quiz description: {quiz.description}</h2>
          {quizQuestions.map((question) => {
            return (
              <div key={question.id}>
                <p>Question {question.id}: {question.question}</p>
                {question.image && <img src={question.image} alt="question" />}
                {answers && answers.map((answer) => {
                    return Object.values(answer).map((ans, i) => {
                      return (
                        <div key={i}>
                          <input type="radio" id={ans.id} name={question.id} value={ans.id}/>
                          <label htmlFor={ans.id}>{ans.text}</label>
                        </div>
                      );
                    })
                })}
              </div>
            );
          })
        }
        {participants && Object.values(participants).map((participant) => {
          if(participant.active === true){
            return (
              <div key={participant.uid}>
                <Avatar src={participant.photoURL} alt={participant.username} />
                <p>Participant: {participant.username}</p>
                <p>Score: {participant.score}</p>
              </div>
            );
          }
        })}
        <p>Participants: {participants ? Object.keys(participants).length : 0}</p>
        </div>
      ) : (
        <p>No quiz available</p>
      )}
    </div>
  );
}