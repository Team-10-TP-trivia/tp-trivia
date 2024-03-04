import PropTypes from 'prop-types';
import { getGroupMessages, sendMessageToGroup } from '../../../services/Groups/Groups-services';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/appContext';
import { getAllUsers } from '../../../services/UserServices/user-post-services';

export default function GroupChat({ group }) {
    const { userData } = useContext(AppContext);
    const [ message, setMessage ] = useState('');
    const [ users, setUsers ] = useState(null);
    const [ groupMessages, setGroupMessages ] = useState(null);

    useEffect(() => {
        getAllUsers().then((snapshot) => {
            setUsers(snapshot);
        });
    }, []);

     useEffect(() => {
        if(!group) return;
    const unsubscribe = getGroupMessages(group.groupId, setGroupMessages);
    return () => unsubscribe();
    }, [group]);

    const sendMessage = async() => {
        if(!group) return;
        await sendMessageToGroup(group.groupId, userData, message);
        setMessage('');
    }

    if(!group || !userData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{group.groupName ? group.groupName.charAt(0).toUpperCase() + group.groupName.slice(1).toLowerCase() : ''} chat</h1>
            <p>Chat with your group members</p>
            {users && users.map((user) => {
                return (
                    <div key={user.uid}>
                        <h3>{user.name}</h3>
                        {groupMessages && Object.values(groupMessages).map((message) => {
                            return Object.values(message).map((m) => {
                                if(m.sender === user.username) {
                                    return (
                                        <div key={m.id}>
                                            <p>{m.sender}: {m.message} - {new Date(m.timestamp).toLocaleString()}</p>
                                        </div>
                                    );
                                }
                            });
                        })}
                    </div>
                );
            })}
            {(!groupMessages || Object.values(groupMessages).length === 0) && (
                <p>No messages available</p>
            )}
            <input type="text" 
            id='message' 
            placeholder='Message' 
            value={message}
            onChange={(e) => setMessage(e.target.value)}/>
            <button onClick={sendMessage}>Send message</button>
        </div>
    );

}

GroupChat.propTypes = {
    group: PropTypes.object,
}