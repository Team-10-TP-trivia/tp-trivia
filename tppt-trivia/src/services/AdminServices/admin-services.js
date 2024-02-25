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

export const sendVerificationToAdmins = async (username, mail, firstName, lastName, school) => {
    const users = await getAllUsers();
    const admins = users.filter((user) => user.role === "admin");

    try {
        for (const admin of admins) {
            const userRef = ref(db, `users/${admin.username}`);
            const userData = await get(userRef);
            const pendingVerifications = userData.val().pendingVerifications || {};
            pendingVerifications[username] = { username, mail, firstName, lastName, school };
            await update(userRef, {
                pendingVerifications,
            });
        }
    } catch (error) {
        console.error("Error updating admin accounts:", error);
        throw error;
    }
}

export const approveTeacherVerification = async (adminUsername, teacherUsername) => {
    try {
        const adminRef = ref(db, `users/${adminUsername}`);
        const adminData = await get(adminRef);
        const pendingVerifications = adminData.val().pendingVerifications || {};
        delete pendingVerifications[teacherUsername];
        await update(adminRef, {
            pendingVerifications,
        });

        const teacherRef = ref(db, `users/${teacherUsername}`);
        await update(teacherRef, {
            verified: true,
        });
    } catch (error) {
        console.error("Error approving teacher verification:", error);
        throw error;
    }
}

export const getAllPendingVerifications = async (adminUsername) => {
    try {
        const adminRef = ref(db, `users/${adminUsername}`);
        const adminData = await get(adminRef);
        return adminData.val().pendingVerifications || [];
    } catch (error) {
        console.error("Error fetching pending verifications:", error);
        throw error;
    }
}