import { push, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const saveQuiz = async (quizData) => {
    try {

        if(quizData.visibility === 'private'){
            quizData.privateCode = generateCode();
        }
        const newQuizRef = await push(ref(db, 'quizes'), quizData);
        console.log("Quiz saved with ID:", newQuizRef.key);
        return newQuizRef; 
    } catch (error) {
        console.error("Failed to save quiz:", error);
        throw error; 
    }
};