import { 
    //get,
    //set,
    ref,
    update,
    //query,
    //equalTo,
    //orderByChild 
} from "firebase/database";
import { db } from "../../config/firebase-config";

export const updateSentRequest = async (username) => {
    const updateTeacherRef = {};
    updateTeacherRef[`users/${username}/pendingVerification`] = true;
    return update(ref(db), updateTeacherRef);
};
