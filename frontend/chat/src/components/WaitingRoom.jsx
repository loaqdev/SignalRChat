import { useState } from 'react';
import '../styles/WaitingRoom.css';

export const WaitingRoom = ({ joinChat }) => {
    const [userName, setUserName] = useState('');
    const [chatName, setChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanUserName = userName.trim();
        const cleanChatName = chatName.trim();

        if (cleanUserName && cleanChatName) {
            setIsLoading(true);
            try {
                await joinChat(cleanUserName, cleanChatName);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="waiting-room-wrapper">
            <form className="waiting-room-form" onSubmit={handleSubmit}>
                <h1>Chat Room</h1>
                <div className="field-group">
                    <label htmlFor="userName">Your Name</label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="field-group">
                    <label htmlFor="chatName">Room Name</label>
                    <input
                        id="chatName"
                        type="text"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        placeholder="e.g. Work, Family..."
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className={`submit-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || !userName.trim() || !chatName.trim()}
                >
                    {isLoading ? 'Joining...' : 'Join Chat'}
                </button>
            </form>
        </div>
    );
};