import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import PropTypes from "prop-types";
import 'react-datepicker/dist/react-datepicker.css'

const Sidebar = ({
  onSave,
  visibility,
  setVisibility,
  timeLimit,
  setTimeLimit,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  questionType,
  setQuestionType,
  activeState,
  setActiveState,
  points,
  setPoints,
}) => {
  const navigate = useNavigate();

  const categories = [
    "General Knowledge",
    "Entertainment",
    "Science",
    "History",
    "Sports",
    "Movies",
    "Shows",
  ];

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="sidebar-slidebar">
      <div className="sidebar-item">
        <label htmlFor="questionType">Question type</label>
        <select
          id="questionType"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option id="option1" value="Quiz">Quiz</option>
          <option id="option2" value="True-False">True or False</option>
        </select>
      </div>


      <div className="sidebar-item">
        <label htmlFor="timeLimit">Time limit</label>
        <select
          id="timeLimit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        >
          <option id="option1" value="10 minutes">10 minutes</option>
          <option id="option2" value="20 minutes">20 minutes</option>
          <option id="option3" value="30 minutes">30 minutes</option>
          <option id="option4" value="40 minutes">40 minutes</option>
          <option id="option5" value="50 minutes">50 minutes</option>
          <option id="option6" value="60 minutes">60 minutes</option>
        </select>
      </div>

      <div className="sidebar-item">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option id="option1" value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-item">
        <label htmlFor="points">Points</label>
        <input 
        type="number"
        id="points"
        value={points}
        onChange={(e) => setPoints(parseInt(e.target.value) || 1)} />
      </div>

      <div className="datepicker-container">
        <label htmlFor="activeState">Active Until</label><br />
        <ReactDatePicker
        selected={activeState}
        id="activeState"
        onChange={() => {
          const endOfDay = new Date();
          endOfDay.setDate(endOfDay.getDate());
          endOfDay.setHours(23, 59, 59, 999);
          setActiveState(endOfDay)
        }}
        dateFormat="MMMM d, yyyy"
        minDate={new Date()}
        />
      </div>
      
      

      <div className="title-sidebar">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="description-sidebar">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          value={description}
          id="description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="cover-image-selection">
        <button >Select Cover Image</button>
      </div>

      <div className="sidebar-item">
        <p>Visibility:</p>
        <div>
          <input
            type="radio"
            id="public"
            name="quizVisibility"
            value="public"
            checked={visibility === "public"}
            onChange={(e) => setVisibility(e.target.value)}
          />
          <label htmlFor="public">Public</label>
        </div>
        <div>
          <input
            type="radio"
            id="private"
            name="quizVisibility"
            value="private"
            checked={visibility === "private"}
            onChange={(e) => setVisibility(e.target.value)}
          />
          <label htmlFor="private">Private</label>
        </div>
      </div>

      <div className="sidebar-buttons">
        <button onClick={handleExit}>Exit</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onSave: PropTypes.func.isRequired,
  visibility: PropTypes.string.isRequired,
  setVisibility: PropTypes.func.isRequired,
  timeLimit: PropTypes.string.isRequired,
  setTimeLimit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  questionType: PropTypes.string.isRequired,
  setQuestionType: PropTypes.func.isRequired,
  activeState: PropTypes.instanceOf(Date).isRequired,
  setActiveState: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired,
  setPoints: PropTypes.func.isRequired,
};

export default Sidebar;
