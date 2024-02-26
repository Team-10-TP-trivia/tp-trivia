import { get, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

export const takeAllQuizzes = async () => {
    try {
        const quizzes = await get(ref(db, 'quizes'));
        return quizzes;
    } catch (error) {
        console.error("Failed to extract all quizzes:", error);
        throw error;
    }
}