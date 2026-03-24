import React, { useEffect, useRef, useState } from 'react';
import { Message } from "./Message";
import '../styles/Chat.css';

export const Chat = ({ messages, chatRoom, closeChat, sendMessage, currentUserName }) => {
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [message, setMessage] = useState("");

    const onSendMessage = (e) => {
        e?.preventDefault();
        if (message.trim() !== "") {
            sendMessage(message);
            setMessage("");
            inputRef.current?.focus();
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Room: {chatRoom}</h2>
                <button className="close-button" onClick={closeChat}>
                    &times;
                </button>
            </div>

            <div className="messages-wrapper">
                {messages.length === 0 ? (
                    <div className="empty-chat">No messages yet...</div>
                ) : (
                    messages.map((msg, index) => (
                        <Message
                            key={index}
                            message={msg}
                            currentUserName={currentUserName}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-input-area" onSubmit={onSendMessage}>
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!message.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};