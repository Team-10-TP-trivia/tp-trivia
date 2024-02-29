import { useNavigate } from "react-router-dom";
import "./Home.css"

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Math', path: '/math', imageUrl: "https://infinitylearn.com/surge/wp-content/uploads/2021/12/MicrosoftTeams-image-58.jpg"  },
    { name: 'Science', path: '/science', imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfeoEy87muoF83imwLpuXLeLu9zXpL7dgxGQ&usqp=CAU" },
    { name: 'General Knowledge', path: '/general-knowledge', imageUrl: "https://www.skillsyouneed.com/images/mind-skills.jpg" },
    { name: 'Sports', path: '/sports', imageUrl: "https://images.indianexpress.com/2019/10/football759_GettyImages-992892836.jpg" }, 
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="main-home-container">
      <h3>Categories</h3>
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-card"
            onClick={() => handleCategoryClick(category.path)}
          >
            <div className="image-overlay-container">
              <img src={category.imageUrl} alt={category.name} />
              <h4 className="category-name">{category.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}