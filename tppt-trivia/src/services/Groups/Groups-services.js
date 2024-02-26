import {
  onValue,
  get,
  set,
  ref,
  off,
  //update,
  //query,
  //equalTo,
  //orderByChild
} from "firebase/database";
import { db } from "../../config/firebase-config";

export const createGroup = async (userId,creatorUsername,firstName,lastName, groupName, groupDescription) => {
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

  export const getAllGroups = (setGroups) => {
    const groupsRef = ref(db, "groups");
    
    // Set up a listener for changes in the groups collection
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        setGroups(snapshot.val());
      } else {
        console.log("No data available");
      }
    };
  
    onValue(groupsRef, callback);
  
    // Return a function to unsubscribe from the listener
    return () => off(groupsRef, callback);
  };
  
  