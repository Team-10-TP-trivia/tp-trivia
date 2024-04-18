import { useContext, useEffect, useState } from "react";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
import { AppContext } from "../../context/appContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const { userData } = useContext(AppContext);
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const navigate = useNavigate();

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    takeAllQuizzes(search).then((quizzes) => {
      setQuizList(quizzes);
      setLoading(false);
    });
  }, [search]);

  if (loading || !userData) {
    return <p>Loading...</p>;
  }

  const handleQuizType = (type) => {
    if (type === "public") {
      navigate("/join-public-quizzes", { state: { quizzes: quizList } });
    } else if (type === "private") {
      navigate("/join-private-quizzes", { state: { quizzes: quizList } });
    }else {
      navigate("/join-user-quizzes", { state: { quizzes: quizList } });
    }
  }

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search quiz by title/or category"
        style={{
          width: "50%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          alignItems: "center",
        }}
      />
      <div><button onClick={() => {
        handleQuizType("public");
      }}>Public quizzes</button></div>
      <div><button onClick={() => {
        handleQuizType("private");
      }}>Private quizzes</button></div>
      <div><button onClick={() => {
        handleQuizType("user");
      }}>Your quizzes</button></div>
      <div
        style={{
          height: "fit-content",
          minHeight: "80vh",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
      </div>
    </>
  );
}
