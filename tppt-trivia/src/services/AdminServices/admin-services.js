import {
  ref,
  //push,
  get,
  // query,
  // equalTo,
  // orderByChild,
  update,
  onValue,
  off,
  // set,
} from "firebase/database";
import { db } from "../../config/firebase-config";

export const getAllUsers = (setUsers) => {

  const usersRef = ref(db, "users");

  const callback = (snapshot) => {
    if (snapshot.exists()) {
      let users = Object.values(snapshot.val());
      setUsers(users);
    } else {
      console.log("No data available");
    }
  };

  onValue(usersRef, callback);

  return () => off(usersRef, callback);
};

const takeAllUsers = async () => {
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

// export const updateAdminDetails = async (username, userInfo) => {
//   const users = await takeAllUsers();
//   const admins = users.filter((user) => user.role === "admin");
//   for (const admin of admins) {
//     const userRef = ref(db, `users/${admin}/pendingVerifications/${username}`);
//     await update(userRef, userInfo);
//   }
// };

export const sendVerificationToAdmins = async (
  username,
  mail,
  firstName,
  lastName,
  school,
  photoURL
) => {
  const users = await takeAllUsers();
  const admins = users.filter((user) => user.role === "admin");

  try {
    for (const admin of admins) {
      const userRef = ref(db, `users/${admin.username}`);
      const userData = await get(userRef);
      const pendingVerifications = userData.val().pendingVerifications || {};
      pendingVerifications[username] = {
        username,
        mail,
        firstName,
        lastName,
        school,
        photoURL: photoURL || "", // Set default value if photoURL is falsy
        approved: "pending",
      };
      await update(userRef, {
        pendingVerifications,
      });
    }

    const teacherRef = ref(db, `users/${username}`);
    await update(teacherRef, {
      verified: false,
      pendingVerification: "pending",
    });
  } catch (error) {
    console.error("Error updating admin accounts:", error);
    throw error;
  }
};

export const approveTeacherVerification = async (
  adminUsername,
  teacherUsername
) => {
  try {
    const adminRef = ref(
      db,
      `users/${adminUsername}/pendingVerifications/${teacherUsername}`
    );
    await update(adminRef, {
      approved: true,
    });

    const teacherRef = ref(db, `users/${teacherUsername}`);
    await update(teacherRef, {
      verified: true,
      pendingVerification: "approved",
    });
  } catch (error) {
    console.error("Error approving teacher verification:", error);
    throw error;
  }
};

export const denyTeacherVerification = async (
  adminUsername,
  teacherUsername
) => {
  try {
    const adminRef = ref(
      db,
      `users/${adminUsername}/pendingVerifications/${teacherUsername}`
    );
    await update(adminRef, {
      approved: false,
    });

    const teacherRef = ref(db, `users/${teacherUsername}`);
    await update(teacherRef, {
      verified: false,
      pendingVerification: "denied",
    });
  } catch (error) {
    console.error("Error denying teacher verification:", error); 
    throw error;
  }
};

export const getAllPendingVerifications = async (adminUsername) => {
  try {
    const adminRef = ref(db, `users/${adminUsername}`);
    const adminData = await get(adminRef);
    return adminData.val().pendingVerifications || [];
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    throw error;
  }
};

export const blockUser = async (user) => {
  const blockedUser = {};
  blockedUser[`users/${user.username}`] = {
    ...user,
    blocked: true,
  };
  return update(ref(db), blockedUser);
};

export const unblockUser = async (user) => {
  const blockedUser = {};
  blockedUser[`users/${user.username}`] = {
    ...user,
    blocked: false,
  };
  return update(ref(db), blockedUser);
};
