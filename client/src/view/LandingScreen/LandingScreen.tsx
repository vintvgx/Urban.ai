import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LandingScreenController from "../../controller/LandingScreenController";
import chatData from "./chat.json";
import "./LandingScreen.css"; // Import the CSS file

export default function LandingScreen() {
  const navigate = useNavigate();
  const { goToChatView } = LandingScreenController({ navigate });

  // State to hold current message index and chat & response text
  const [messageIndex, setMessageIndex] = useState(0);
  const [chatText, setChatText] = useState(chatData[messageIndex].input);
  const [responseText, setResponseText] = useState(
    chatData[messageIndex].response
  );

  const typewriterDurationPerChar = 0.1; // Duration in seconds for each character

  useEffect(() => {
    let typewriterDuration =
      responseText.length * typewriterDurationPerChar * 1000 + 1000; // Total duration in ms (including 1s starting delay)
    let responseDelay = 1000; // 3 seconds after typing ends
    let totalDuration = typewriterDuration + responseDelay;

    const interval = setInterval(() => {
      const nextIndex = (messageIndex + 1) % chatData.length;

      // Start typing after a short delay (to simulate reading time)
      setTimeout(() => {
        setMessageIndex(nextIndex);
        setChatText(chatData[nextIndex].input);
        setResponseText(chatData[nextIndex].response);
      }, responseDelay);
    }, totalDuration);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [messageIndex, responseText.length]);

  return (
    <div className="container">
      <Header setPadding={true} />
      <div className="center-screen">
        <h1 className="chat-text">
          <span className="font-bold">Urban AI</span>, {chatText}
        </h1>
        <p
          key={messageIndex}
          className="response-text"
          style={{
            animation: `typewriter ${
              responseText.length * typewriterDurationPerChar
            }s steps(${responseText.length}, end) 1s 1 normal both, 
                blinkTextCursor 500ms step-end ${
                  responseText.length * typewriterDurationPerChar + 1
                }s infinite`,
          }}>
          {responseText}
        </p>

        <button className="chat-button" onClick={goToChatView}>
          Chat Now
        </button>
      </div>
      <Footer />
    </div>
  );
}
