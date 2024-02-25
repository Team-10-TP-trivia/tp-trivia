import {
    ref,
    //push,
    get,
    // query,
    // equalTo,
    // orderByChild,
    update,
    // set,
  } from "firebase/database";
import { db } from "../../config/firebase-config";


export const getAllUsers = async () => {
    try {
        const snapshot = await get(ref(db, "users"));
        if (!snapshot.exists()) {
          return [];
        }
        const users = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        return users;
      }
      catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
}
// For approval of teacher verification
// export const verifyTeacherFromAdmin = async (userId, school, certificate) => {
//     try {
//         const userRef = ref(db, `users/${userId}`);
//         await update(userRef, {
//           verified: true,
//           school,
//           certificate,
//         });
//       } catch (error) {
//         console.error("Error verifying teacher:", error);
//         throw error;
//       }
// }

export const sendVerificationToAdmins = async (username, school) => {
    const users = await getAllUsers();
    const admins = users.filter((user) => user.role === "admin");

    try {
        for (const admin of admins) {
            const userRef = ref(db, `users/${admin.username}`);
            const userData = await get(userRef);
            const pendingVerifications = userData.val().pendingVerifications || {};
            pendingVerifications[username] = { school };
            await update(userRef, {
                pendingVerifications,
            });
        }
    } catch (error) {
        console.error("Error updating admin accounts:", error);
        throw error;
    }
}