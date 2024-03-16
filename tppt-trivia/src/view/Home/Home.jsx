import DemoQuizzes from '../Demo/DemoQuiz';
import './Home.css'; 

export default function Home() {

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
          <button className="sign-up-btn">Sign up now</button>
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
          <h3>Top 10 Rankings</h3>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>7</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>9</td>
                <td>Alice</td>
                <td>1234</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="demo-quiz-container">
          <DemoQuizzes />
        </section>
    </div>
  );
}
