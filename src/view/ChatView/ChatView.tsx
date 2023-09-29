import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import { IMessage } from "../../model/types";
import { useAppSelector } from "../../redux/store";
import { urban_query } from "../../stack.ai/urban-ai-query";
import "./ChatView.css";

const ChatView: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [botIsThinking, setBotIsThinking] = useState(false);
  const [inputAreaBottom, setInputAreaBottom] = useState(500);
  const [messageAdded, setMessageAdded] = useState<number>(0);
  const [messages, setMessages] = useState<IMessage[]>([]); // Chat history
  const [lastSavedMessageIndex, setLastSavedMessageIndex] = useState<number>(0);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const user = useAppSelector((state) => state.user);

  const generateSessionID = () => {
    return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const [sessionID, setSessionID] = useState<string>(generateSessionID());

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage: IMessage = {
      type: "user",
      content: input,
      timestamp: new Date().toISOString(),
      session_id: sessionID,
    };
    setMessages([...messages, userMessage]);
    setMessageAdded((prev) => prev + 1); // Increment the counter for user message
    setBotIsThinking(true);

    const data = {
      "in-0": input,
    };

    // const unsavedMessages = messages.slice(lastSavedMessageIndex); // +2 to account for userMessage and botMessage
    // console.log(
    //   "🚀 ~ file: ChatView.tsx:53 ~ handleSubmit ~ unsavedMessages:",
    //   unsavedMessages
    // );

    setTimeout(async () => {
      const response = await urban_query(data);

      const botMessage: IMessage = {
        type: "bot",
        content: response,
        timestamp: new Date().toISOString(),
        session_id: sessionID,
      }; // Added timestamp and session_id

      const newMessages = [...messages, userMessage, botMessage];
      setMessages(newMessages);

      setBotIsThinking(false);
      setMessageAdded((prev) => prev + 1); // Increment the counter for bot message

      // If user is signed in
      if (user.isLoggedIn) {
        try {
          // Save the messages
          await fetch("http://localhost:4000/store-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer`,
            },
            body: JSON.stringify({
              messages: newMessages,
              userId: user.user?.uid,
              sessionID,
            }),
          });
          console.log("----------CHATBOT SAVED-----------");

          // Update the index of the last saved message
          setLastSavedMessageIndex(messages.length + 2);
        } catch (error) {
          console.error("Failed to store messages", error);
        }
      }
    }, 2000);

    setInput("");
  };

  useEffect(() => {
    // Scroll to the bottom whenever the messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, botIsThinking]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const chatContainerHeight = chatContainerRef.current.offsetHeight;
      const screenHeight = window.innerHeight;

      let newBottomValue = screenHeight - chatContainerHeight - 250;

      if (newBottomValue > 500) {
        newBottomValue = 500;
      }

      if (newBottomValue < screenHeight * 0.02) {
        newBottomValue = screenHeight * 0.02;
      }

      setInputAreaBottom(newBottomValue);
    }
  }, [messages, botIsThinking, messageAdded]);

  return (
    <div style={{ height: "100vh" }}>
      <Header />
      <div className="chat-wrapper">
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${message.type}-message-wrapper ${
                message.type === "user"
                  ? "user-message-entering"
                  : message.type === "bot"
                  ? "bot-message-entering"
                  : ""
              }`}>
              {/* <div className={`${message.type}-label label`}>
                {message.type.toUpperCase()}
              </div> */}
              <div className={`${message.type}-message`}>
                {typeof message.content === "string"
                  ? message.content
                  : JSON.stringify(message.content)}
              </div>
            </div>
          ))}
          {botIsThinking && (
            <div className="message-wrapper bot-message-wrapper">
              {/* <div className="bot-label label">BOT</div> */}
              <div className="bot-message">
                <div className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="input-area"
          style={{
            position: "absolute",
            bottom: `${inputAreaBottom}px`,
          }}>
          <textarea
            autoFocus
            rows={1}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
