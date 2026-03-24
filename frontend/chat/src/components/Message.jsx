import '../styles/Message.css';

export const Message = ({ message, currentUserName }) => {
    const isOwnMessage = message.userName === currentUserName;
    const isAdmin = message.userName === "Admin";

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`message-wrapper ${isOwnMessage ? 'own' : ''} ${isAdmin ? 'admin' : ''}`}>
            {!isAdmin && (
                <span className="message-user">
                    {isOwnMessage ? "You" : message.userName}
                </span>
            )}
            <div className="message-bubble">
                <span className="message-text">{message.text}</span>
                {!isAdmin && (
                    <span className="message-time">
                        {formatTime(message.sentAt)}
                    </span>
                )}
            </div>
        </div>
    );
};