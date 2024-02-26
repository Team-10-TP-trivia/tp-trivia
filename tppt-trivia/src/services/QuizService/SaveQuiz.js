import { push, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

export const saveQuiz = async (quizData) => {
    try {
        const newQuizRef = await push(ref(db, 'quizes'), quizData);
        console.log("Quiz saved with ID:", newQuizRef.key);
        return newQuizRef; 
    } catch (error) {
        console.error("Failed to save quiz:", error);
        throw error; 
    }
};