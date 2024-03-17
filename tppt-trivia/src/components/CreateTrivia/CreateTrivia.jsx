import { useContext, useState } from "react";
import "./CreateTrivia.css";
import Sidebar from "./Sidebar/Sidebar";
import { saveQuiz } from "../../services/QuizService/SaveQuiz";
import { AppContext } from "../../context/appContext";
import Modal from "../ModalComponent/Modal";
import { useNavigate } from "react-router-dom";

export default function CreateTrivia() {
  const { userData } = useContext(AppContext);
  const [questionType, setQuestionType] = useState("Quiz");
  const [slides, setSlides] = useState([
    {
      id: 1,
      question: "",
      questionType: "Quiz",
      answers: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
      selectedUnsplash: null,
      selectedGif: null,
      points: 1,
    },
  ]);

  const [activeSlideId, setActiveSlideId] = useState(1);
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General Knowledge");
  const [selectedGif, setSelectedGif] = useState(null); 
  const [selectedUnsplash, setSelectedUnsplash] = useState(null); 
  const [timeLimit, setTimeLimit] = useState('10 minutes');
  const [activeState, setActiveState] = useState("");

  const navigate = useNavigate();
 

  const handleSelectUnsplash = (unsplashUrl) => {
    setSelectedUnsplash(unsplashUrl); 
    setSelectedGif(null);
    const updatedSlides = slides.map((slide) => {
      if (slide.id === activeSlideId) {
        return { ...slide, selectedUnsplash: unsplashUrl, selectedGif:null };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const handleSelectGif = (gifUrl) => {
    setSelectedGif(gifUrl); 
    setSelectedUnsplash(null);
    const updatedSlides = slides.map((slide) => {
      if (slide.id === activeSlideId) {
        return { ...slide, selectedGif: gifUrl, selectedUnsplash: null };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };


  const addSlide = () => {
    const newId = slides.length + 1;
    const newSlide = {
      id: newId,
      question: "",
      questionType: questionType,
      answers: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
      selectedUnsplash: null,
      selectedGif: null,
      points: 1,
    };
    setSlides([...slides, newSlide]);
    setTitle("");
    setDescription("");
    setActiveSlideId(newId);
    setCategory("General Knowledge");
    setQuestionType("Quiz");
  };

  const updateQuestionType = (newType) => {
    setQuestionType(newType);
    const updatedSlides = slides.map((slide) => {
      if (slide.id === activeSlideId) {
        const type =
          newType === "Quiz"
            ? [
                { id: 1, text: "", isCorrect: false },
                { id: 2, text: "", isCorrect: false },
                { id: 3, text: "", isCorrect: false },
                { id: 4, text: "", isCorrect: false },
              ]
            : [
                { id: 1, text: "True", isCorrect: false },
                { id: 2, text: "False", isCorrect: false },
              ];
        return { ...slide, questionType: newType, answers: type };
      }
      return slide;
    });
    setSlides(updatedSlides);
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


  const handlePointsChange = (newPoints, slideId = activeSlideId) => {
    const updatedSlides = slides.map((slide) =>
      slide.id === slideId ? { ...slide, points: newPoints } : slide
    );
    setSlides(updatedSlides);
  };

  const handleSaveQuiz = async () => {

    if(!title.trim() || !description.trim()){
      alert('Please fill in the title and the description.');
      return
    }

    for(const slide of slides){
      if(!slide.question.trim() || slide.answers.some(answer => !answer.text.trim())){
        alert('Please fill in all the questions and answers');
        return
      }
      if(!slide.answers.some(answer => answer.isCorrect)){
        alert('Please select correct answer for each question.');
        return
      }
    }
    const isActive = new Date () <= new Date(activeState);
    const quizData = {
      creatorId: userData.uid,
      username: userData.username,
      title,
      description,
      visibility,
      category,
      questions: slides,
      unsplashImg: selectedUnsplash,
      media: selectedGif,
      createdOn: new Date().toLocaleDateString("bg-BG"),
      timeLimit: timeLimit,
      isActive,
      activeState: activeState.toLocaleDateString('bg-BG'),
    };

    try {
      await saveQuiz(quizData);
      navigate('/join-room');
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
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

        <div>
          <Modal onSelectGif={handleSelectGif} onSelectUnsplash={handleSelectUnsplash} />
          {getActiveSlide().selectedGif && (
            <div style={{ marginTop: "20px" }}>
              <img
                src={getActiveSlide().selectedGif}
                alt="Selected GIF"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </div>
          )}
          {getActiveSlide().selectedUnsplash && (
            <div style={{ marginTop: "20px" }}>
              <img
                src={getActiveSlide().selectedUnsplash}
                alt="Selected Unsplash"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </div>
          )}
        </div>

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
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        activeState={activeState}
        setActiveState={setActiveState}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        questionType={questionType}
        setQuestionType={updateQuestionType}
        points={getActiveSlide().points}
        setPoints={handlePointsChange}
      />
    </div>
  );
}
