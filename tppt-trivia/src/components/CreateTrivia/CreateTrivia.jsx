import { useState } from 'react';
import './CreateTrivia.css';

export default function CreateTrivia() {
  const [slides, setSlides] = useState([{ id: 1, question: ''}]);
  const [activeSlideId, setActiveSlideId] = useState(1); 

  const addSlide = () => {
    const newId = slides.length > 0 ? slides.length + 1 : 1; 
    const newSlide = { id: newId, question: ''};
    setSlides([...slides, newSlide]); 
    setActiveSlideId(newId);
  };

  const duplicateSlide = (slideId) => {
    const newId = slides.length + 1 
    const slideToDuplicate = slides.find(slide => slide.id === slideId); 
    if (slideToDuplicate) {
      const newSlide = { ...slideToDuplicate, id: newId };
      setSlides([...slides, newSlide]);
    }
  };

  const deleteSlide = (slideId) => {
    if(slides.length === 1){
        alert(`You have no power here kek`);
        return
    }
    const index = slides.findIndex(slide => slide.id === slideId); // Взимаме индекса на слайда, който ще бъде изтрит
    const updatedSlides = slides.filter(slide => slide.id !== slideId); // Премахва слайда, който искаме да изтрием
    setSlides(updatedSlides);
    if(index > 0){
        setActiveSlideId(updatedSlides[index - 1].id) // Връща активния слайд да бъде този, който е над изтрития
    }
  };

  const updateSlideQuestion = (slideId, question) => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === slideId) {
        return { ...slide, question: question };
      }
      return slide;
    });
    console.log(question)
    setSlides(updatedSlides);
  };

  const getActiveSlide = () => {
    return slides.find(slide => slide.id === activeSlideId) || slides[0];
  };

return (
    <div className="create-trivia-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <button onClick={addSlide}>Add Slide</button>
        </div>
        <ul className="slides-list">
          {slides.map((slide, index) => (
            <li key={slide.id}
                className={`slide-entry ${activeSlideId === slide.id ? 'active' : ''}`}
                onClick={() => setActiveSlideId(slide.id)}>
              <div className="slide-entry-header">
                <span>Quiz {index + 1}</span>
                <div className="slide-entry-buttons">
                    {/*Този евент propogation спира bubblinga и кара activeSlide да работи*/}
                  <button onClick={(e) =>{e.stopPropagation(); duplicateSlide(slide.id)}}>Duplicate</button>
                  <button onClick={(e) =>{e.stopPropagation(); deleteSlide(slide.id)}}>Delete</button>
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
      </div>
    </div>
  );
}
