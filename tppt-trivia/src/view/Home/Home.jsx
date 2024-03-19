import { useEffect, useState } from 'react';
import DemoQuizzes from '../Demo/DemoQuiz';
import './Home.css'; 
import { getAllUsers } from '../../services/AdminServices/admin-services';
import { FaCrown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [ users, setUsers ] = useState([]);
  const [ userGlobalScores, setUserGlobalScores ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const f = async () => {
      const unsubscribe = await getAllUsers(setUsers);
      return () => unsubscribe();
    };
    f();
  }, []);

  useEffect(() => {
  if(users) {
    const scores = users
      .filter(user => user.takenQuizzes) // Filter users who have taken quizzes
      .map(user => {
        // Use reduce to sum the scores for each quiz
        const totalScore = Object.values(user.takenQuizzes).reduce((total, quiz) => {
          const quizScore = Object.values(quiz).reduce((acc, score) =>acc + score, 0);
          return total + quizScore;
        }, 0);
        return { username: user.username,firstName: user.firstName, lastName: user.lastName, totalScore }; // Return an object that contains the username and the total score
      });
      const sortedScores = scores.sort((a, b) => b.totalScore - a.totalScore);

      // Take only the top 3 scores
      const topThreeScores = sortedScores.slice(0, 3);
  
      setUserGlobalScores(topThreeScores);
  }
}, [users]);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Experience a new era of Quiz Play</h1>
          <p>
            TPPT Trivia is more than flashcards: it’s the #1 global learning
            platform. Join our community of hundreds of learners using
            TPPT Trivia practice tests and Expert Solutions to improve their grades and reach their goals.
          </p>
          <button className="sign-up-btn" onClick={() => navigate('/register')}>Sign up now</button>
        </div>
      </section>

      <section className="global-ranking-section">
        <div className="global-ranking-text">
          <h1>Track Your Global Ranking</h1>
          <p>
            See how you stack up against learners from around the world on our global leaderboard. 
            Challenge yourself to climb the ranks and achieve trivia mastery!
          </p>
        </div>
        <div className="global-ranking-table">
          <h3>Top 3 Rankings</h3>
          {userGlobalScores.length > 0 && (
            <div className="user-ranking">
              <table>
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                {userGlobalScores.map((user, index) => (
                  <tbody key={index}>
                    <tr >
                      <td>{index + 1} <FaCrown id={`crown${index+1}`}/></td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.totalScore} pt.</td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="demo-quiz-container">
        <DemoQuizzes />
      </section>
    </div>
  );
}
