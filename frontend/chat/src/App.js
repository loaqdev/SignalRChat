import { useState } from "react";
import { WaitingRoom } from "./components/WaitingRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Chat } from "./components/Chat";
import './styles/App.css';

function App() {
  const [connection, setConnection] = useState(null);
  const [chatRoom, setChatRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");

  const joinChat = async (userName, chatRoom) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5174/chat")
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (messageDto) => {
        setMessages((prevMessages) => [...prevMessages, messageDto]);
      });

      await connection.start();
      await connection.invoke("JoinChat", { userName, chatRoom });

      setConnection(connection);
      setChatRoom(chatRoom);
      setCurrentUserName(userName);
    } catch (error) {
      console.error(error);
      alert("Can not to connect to chat.");
    }
  };

  const sendMessage = async (message) => {
    try {
      if (connection) {
        await connection.invoke("SendMessage", message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeChat = async () => {
    try {
      if (connection) {
        await connection.stop();
        setConnection(null);
        setMessages([]);
        setChatRoom("");
        setCurrentUserName("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container">
      {!connection ? (
        <WaitingRoom joinChat={joinChat} />
      ) : (
        <Chat
          messages={messages}
          chatRoom={chatRoom}
          sendMessage={sendMessage}
          closeChat={closeChat}
          currentUserName={currentUserName}
        />
      )}
    </div>
  );
}

export default App;