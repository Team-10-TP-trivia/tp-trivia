import { useContext, useState } from "react";
import "./CreateTrivia.css";
import Sidebar from "./Sidebar/Sidebar";
import { saveQuiz } from "../../services/QuizService/SaveQuiz";
import { AppContext } from "../../context/appContext";

export default function CreateTrivia() {
  const { userData } = useContext(AppContext);
  const [slides, setSlides] = useState([
    {
      id: 1,
      question: "",
      answers: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
      timeLimit: '20 seconds'
    },
  ]);

  const [activeSlideId, setActiveSlideId] = useState(1);
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General Knowledge");

  const addSlide = () => {
    const newId = slides.length + 1;
    const newSlide = {
      id: newId,
      question: "",
      answers: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
      timeLimit: "20 seconds",
    };
    setSlides([...slides, newSlide]);
    setTitle('');
    setDescription('');
    setActiveSlideId(newId);
    setCategory('General Knowledge');
  };

  const duplicateSlide = (slideId) => {
    const newId = slides.length + 1;
    const slideToDuplicate = slides.find((slide) => slide.id === slideId);
    if (slideToDuplicate) {
      const newSlide = {
        ...slideToDuplicate,
        id: newId,
        answers: [...slideToDuplicate.answers],
      };
      setSlides([...slides, newSlide]);
    }
  };

  const deleteSlide = (slideId) => {
    if (slides.length === 1) {
      alert(`You have no power here kek`);
      return;
    }
    const index = slides.findIndex((slide) => slide.id === slideId); // Взимаме индекса на слайда, който ще бъде изтрит
    const updatedSlides = slides.filter((slide) => slide.id !== slideId); // Премахва слайда, който искаме да изтрием
    setSlides(updatedSlides);
    if (index > 0) {
      setActiveSlideId(updatedSlides[index - 1].id); // Връща активния слайд да бъде този, който е над изтрития
    }
  };

  const updateSlideQuestion = (slideId, question) => {
    const updatedSlides = slides.map((slide) => {
      if (slide.id === slideId) {
        return { ...slide, question: question };
      }
      return slide;
    });
    // console.log(question);
    setSlides(updatedSlides);
  };

  const getActiveSlide = () => {
    return slides.find((slide) => slide.id === activeSlideId) || slides[0];
  };

  const updateAnswerText = (slideId, answerId, text) => {
    const updatedSlides = slides.map((slide) => {
      if (slide.id === slideId) {
        return {
          ...slide,
          answers: slide.answers.map((answer) => {
            if (answer.id === answerId) {
              return { ...answer, text: text };
            }
            return answer;
          }),
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const updateCorrectAnswer = (slideId, answerId) => {
    const updatedSlides = slides.map((slide) => {
      if (slide.id === slideId) {
        return {
          ...slide,
          answers: slide.answers.map((answer) => {
            return { ...answer, isCorrect: answer.id === answerId };
          }),
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const handleSaveQuiz = async () => {
    console.log(userData);
    const quizData = {
      creatorId: userData.uid,
      username: userData.username,
      title,
      description,
      visibility,
      category,
      questions: slides,
      createdOn: new Date().toLocaleDateString("bg-BG"),
    };

    try {
      await saveQuiz(quizData);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const updateTimeLimit = (slideId, newTimeLimit) => {
    const updatedTime = slides.map((slide) => {
      if (slide.id === slideId) {
        return { ...slide, timeLimit: newTimeLimit };
      }
      return slide;
    });
    setSlides(updatedTime);
  };

  return (
    <div className="create-trivia-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <button onClick={addSlide}>Add Slide</button>
        </div>
        <ul className="slides-list">
          {slides.map((slide, index) => (
            <li
              key={slide.id}
              className={`slide-entry ${
                activeSlideId === slide.id ? "active" : ""
              }`}
              onClick={() => setActiveSlideId(slide.id)}
            >
              <div className="slide-entry-header">
                <span>Quiz {index + 1}</span>
                <div className="slide-entry-buttons">
                  {/*Този евент propogation спира bubblinga и кара activeSlide да работи*/}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSlide(slide.id);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(slide.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="slide-entry-content">
                {slide.question || "Question"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <input
          type="text"
          value={getActiveSlide().question}
          onChange={(e) => updateSlideQuestion(activeSlideId, e.target.value)}
          placeholder="Start typing your question"
          className="question-input"
        />

        <div className="answers-container">
          {getActiveSlide().answers.map((answer, index) => (
            <div key={index} className="answer-option">
              <input
                type="radio"
                name={`correct-answer-${activeSlideId}`}
                checked={answer.isCorrect}
                onChange={() => updateCorrectAnswer(activeSlideId, answer.id)}
                className="correct-answer-radio"
              />
              <input
                type="text"
                value={answer.text}
                placeholder="Add answer"
                onChange={(e) =>
                  updateAnswerText(activeSlideId, answer.id, e.target.value)
                }
                className="answer-input"
              />
            </div>
          ))}
        </div>
      </div>

      <Sidebar
        onSave={handleSaveQuiz}
        visibility={visibility}
        setVisibility={setVisibility}
        timeLimit={getActiveSlide().timeLimit}
        setTimeLimit={(newTimeLimit) => 
            updateTimeLimit(activeSlideId, newTimeLimit)}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
      />
    </div>
  );
}
