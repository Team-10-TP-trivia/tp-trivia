import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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
          <option value="Quiz">Quiz</option>
          <option value="True-False">True or False</option>
        </select>
      </div>

      <div className="sidebar-item">
        <label htmlFor="timeLimit">Time limit</label>
        <select
          id="timeLimit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        >
          <option value="20 seconds">20 seconds</option>
          <option value="30 seconds">30 seconds</option>
          <option value="40 seconds">40 seconds</option>
          <option value="60 seconds">60 seconds</option>
          <option value="90 seconds">90 seconds</option>
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
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="title-sidebar">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="description-sidebar">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          value={description}
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
};

export default Sidebar;
