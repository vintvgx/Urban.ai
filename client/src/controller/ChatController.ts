// ChatController.ts
import { IMessage } from "../model/types";
import { urban_query } from "../stack.ai/urban-ai-query";
import {
  extractTimestampFromSessionID,
  formatResponse,
} from "../utils/functions";

// const SERVER_URL = "http://localhost:4000";

const SERVER_URL = "https://urban-ai-app-4dpgega65a-ue.a.run.app";

export const generateSessionID = () => {
  return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const fetchChatHistory = async (user: any) => {
  try {
    const response = await fetch(
      `${SERVER_URL}/fetch-messages/${user.user?.uid}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Add the createdAt property to each message
    const dataWithCreatedAt = data.map((message: IMessage) => ({
      ...message,
      createdAt: extractTimestampFromSessionID(message.sessionID),
    }));

    const sortedHistory = dataWithCreatedAt.sort(
      (a: IMessage, b: IMessage) =>
        //descending order
        b.createdAt!.getTime() - a.createdAt!.getTime()
    );

    return sortedHistory;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return [];
  }
};

export const handleSendMessage = async (
  input: string,
  user: any,
  userMessage: IMessage,
  messages: IMessage[],
  sessionID: string
) => {
  const data = {
    "in-0": input,
  };

  let response = await urban_query(data);

  response = formatResponse(response);

  const botMessage: IMessage = {
    type: "bot",
    content: response,
    timestamp: new Date().toISOString(),
    sessionID: sessionID,
  };

  const newMessages = [...messages, userMessage, botMessage];

  // If user is signed in
  if (user.isLoggedIn) {
    try {
      // Save the messages (both user and bot)
      await fetch(`${SERVER_URL}/store-message`, {
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
    } catch (error) {
      console.error("Failed to store messages", error);
    }
  }

  return botMessage;
};

export const handleOpenAIResponse = async (
  input: string,
  user: any,
  userMessage: IMessage,
  messages: IMessage[],
  sessionID: string
) => {
  try {
    //fetch response to the api combining the chat log array of messages and sending it as a mesage to localhost:3000 as a post
    const response = await fetch(`${SERVER_URL}/open-ai-response-server`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const botMessage: IMessage = {
      type: "bot",
      content: data.message,
      timestamp: new Date().toISOString(),
      sessionID: sessionID,
    };

    const newMessages = [...messages, userMessage, botMessage];

    // Post to MongoDB if user is signed in
    if (user.isLoggedIn) {
      try {
        // Save the messages (both user and bot)
        await fetch(`${SERVER_URL}/store-message`, {
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
      } catch (error) {
        console.error("Failed to store messages", error);
      }
    }

    return botMessage;
  } catch (error) {
    console.error("Error in handleOpenAIResponse:", error);
    const botMessage: IMessage = {
      type: "bot",
      content: "API has been overloaded. Please try again later.",
      timestamp: new Date().toISOString(),
      sessionID: sessionID,
    };
    return botMessage;
  }
};
