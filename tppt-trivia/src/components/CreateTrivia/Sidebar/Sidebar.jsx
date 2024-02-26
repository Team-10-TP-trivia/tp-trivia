import { useState } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [questionType, setQuestionType] = useState('Quiz');
  const [timeLimit, setTimeLimit] = useState('20 seconds');
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  }

  return (
    <div className="sidebar-slidebar">
      <div className="sidebar-item">
        <label htmlFor="questionType">Question type</label>
        <select id="questionType" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
          <option value="Quiz">Quiz</option>
          <option value="True-False">True or False</option>
        </select>
      </div>

      <div className="sidebar-item">
        <label htmlFor="timeLimit">Time limit</label>
        <select id="timeLimit" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
          <option value="20 seconds">20 seconds</option>
          <option value="30 seconds">30 seconds</option>
          <option value="40 seconds">40 seconds</option>
          <option value="60 seconds">60 seconds</option>
          <option value="90 seconds">90 seconds</option>
        </select>
      </div>

      <div className='title-sidebar'>
        <label htmlFor="title">Title</label>
        <input type="text" />
      </div>

      <div className='description-sidebar'>
        <label htmlFor="description">Description</label>
        <input type="text" />
      </div>

      <div className="sidebar-buttons">
        <button onClick={handleExit}>Exit</button>
        <button>Save</button>
      </div>
     
    </div>
  );
};

export default Sidebar;
