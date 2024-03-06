import {
  onValue,
  get,
  set,
  ref,
  off,
  update,
  //query,
  //equalTo,
  //orderByChild
} from "firebase/database";
import { db } from "../../config/firebase-config";
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
export const createGroup = async (
  userId,
  creatorUsername,
  firstName,
  lastName,
  groupName,
  groupDescription
) => {
  const groupRef = ref(db, `groups/${groupName}`);

  try {
    // Check if the group already exists
    const groupSnapshot = await get(groupRef);

    if (groupSnapshot.exists()) {
      // Group already exists, you can handle this case accordingly
      return;
    } else {
      // Group doesn't exist, create it
      await set(groupRef, {
        groupIds: generateUUID(),
        userId,
        firstName,
        lastName,
        creatorUsername,
        groupName,
        groupDescription,
      });
    }
  } catch (error) {
    console.error("Error creating group:", error.message);
  }
};

export const getAllGroups = (setGroups, searchKeyword) => {
  const groupsRef = ref(db, "groups");

  // Set up a listener for changes in the groups collection
  const callback = (snapshot) => {
    if (snapshot.exists()) {
      let groups = snapshot.val();

      // Filter groups by title if searchKeyword is provided
      if (searchKeyword) {
        groups = Object.values(groups).filter((group) =>
          group.groupName.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      setGroups(groups);
    } else {
      console.log("No data available");
    }
  };

  onValue(groupsRef, callback);

  // Return a function to unsubscribe from the listener
  return () => off(groupsRef, callback);
};

export const getGroupById = async (groupId) => {
  const groupRef = ref(db, `groups/${groupId}`);
  const groupSnapshot = await get(groupRef);

  if (groupSnapshot.exists()) {
    return groupSnapshot.val();
  } else {
    console.log("Group does not exist");
  }
};

export const getGroupByIdOnChange = (groupId, setGroup) => {
  const groupRef = ref(db, `groups/${groupId}`);

  // Set up a listener for changes in the group data
  const callback = (snapshot) => {
    if (snapshot.exists()) {
      const group = {
        groupId,
        ...snapshot.val(),
      };

      setGroup(group);
    } else {
      console.log("Group does not exist");
    }
  };

  onValue(groupRef, callback);

  // Return a function to unsubscribe from the listener
  return () => off(groupRef, callback);
};

export const sendJoinGroupRequest = async (groupId, userName, user) => {
  const groupUsersUpdate = {};
  groupUsersUpdate[(db, `groups/${groupId}/requests/${userName}`)] = {
    ...user,
    approved: "pending",
  };
  return update(ref(db), groupUsersUpdate);
};

export const approveUserRequest = async (groupId, userName, user) => {
  const groupUsersUpdate = {};
  groupUsersUpdate[(db, `groups/${groupId}/requests/${userName}`)] = null;
  groupUsersUpdate[(db, `groups/${groupId}/users/${userName}`)] = user;
  return update(ref(db), groupUsersUpdate);
};

export const rejectUserRequest = async (groupId, userName) => {
  const groupUsersUpdate = {};
  groupUsersUpdate[(db, `groups/${groupId}/requests/${userName}`)] = null;
  return update(ref(db), groupUsersUpdate);
}

export const removeUserFromGroup = async (groupId, userName) => {
  const groupUsersUpdate = {};
  groupUsersUpdate[(db, `groups/${groupId}/users/${userName}`)] = null;
  return update(ref(db), groupUsersUpdate);
}

export const sendMessageToGroup = async (groupId,user, message) => {
  const id = generateUUID()
  const messageRef = ref(db, `groups/${groupId}/messages/${user.username}/${id}`);
  const userMessage = {
    id,
    message,
    sender: user.username,
    timestamp: Date.now(),
  };
  await set(messageRef, userMessage);
}

export const getGroupMessages = (groupId, setMessages) => {
  const messagesRef = ref(db, `groups/${groupId}/messages`);

  // Set up a listener for changes in the messages collection
  const callback = (snapshot) => {
    if (snapshot.exists()) {
      const messages = snapshot.val();
      setMessages(messages);
    } else {
      setMessages(null);
    }
  };

  onValue(messagesRef, callback);

  // Return a function to unsubscribe from the listener
  return () => off(messagesRef, callback);
};
export const updateUserMessage = async (groupId, username, messageId, message) => {
  const updateUserMessage = {};
  updateUserMessage[`groups/${groupId}/messages/${username}/${messageId}/message`] = message;
  return update(ref(db), updateUserMessage);
}

export const deleteUserMessage =  (groupId, username, messageId) => {
  const deleteUserMessage = {};
  deleteUserMessage[`groups/${groupId}/messages/${username}/${messageId}`] = null;
  return update(ref(db), deleteUserMessage);
}