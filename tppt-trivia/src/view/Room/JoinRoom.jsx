import { useContext, useEffect, useState } from "react";
import PrivateRooms from "./PrivateRoom/PrivateRooms";
import PublicRooms from "./PublicRoom/PublicRooms";
import UserQuizzes from "./UserQuizzes/UserQuizzes";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
import { AppContext } from "../../context/appContext";
import { useSearchParams } from "react-router-dom";
export default function JoinRoom() {
  const { userData } = useContext(AppContext);
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

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

  return (
    <div style={{
      height: "fit-content",
      minHeight: "60vh",
    }}>
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
      <PublicRooms quizList={quizList} />
      <PrivateRooms quizList={quizList} />
      {(userData.role === "teacher" || userData.role === "admin") && (
        <UserQuizzes quizList={quizList} />
      )}
    </div>
  );
}
