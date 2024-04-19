import { useContext, useEffect, useState } from "react";
import { takeAllQuizzes } from "../../services/QuizService/Quizzes";
import { AppContext } from "../../context/appContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import "./JoinRoom.css";

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
    } else {
      navigate("/join-user-quizzes", { state: { quizzes: quizList } });
    }
  };

  return (
    <>
      {/* <input
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
        /> */}
      <Box
        sx={{
          height: "fit-content",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          minHeight: "400px",
          flexWrap: "wrap",
        }}
      >
        <Paper
          elevation={3}
          className="quiz-types"
          sx={{
            padding: "20px",
            width: "200px",
            height: "70px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#d2f5bf",
              transition: "background-color 0.3s, transform 0.3s",
              transform: "scale(1.1)",
            },
          }}
          onClick={() => {
            handleQuizType("public");
          }}
        >
          Public quizzes
        </Paper>
        <Paper
          elevation={3}
          className="quiz-types"
          sx={{
            padding: "20px",
            width: "200px",
            height: "70px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#d2f5bf",
              transition: "background-color 0.3s, transform 0.3s",
              transform: "scale(1.1)",
            },
          }}
          onClick={() => {
            handleQuizType("private");
          }}
        >
          Private quizzes
        </Paper>
        {userData?.role === "teacher" && (
          <Paper
            elevation={3}
            className="quiz-types"
            sx={{
              padding: "20px",
              width: "200px",
              height: "70px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              cursor: "pointer",
              ":hover": {
                backgroundColor: "#d2f5bf",
                transition: "background-color 0.3s, transform 0.3s",
                transform: "scale(1.1)",
              },
            }}
            onClick={() => {
              handleQuizType("user");
            }}
          >
            Your quizzes
          </Paper>
        )}
      </Box>
    </>
  );
}
