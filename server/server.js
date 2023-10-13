const express = require("express");
const path = require("path");
const { connectDB, getDB } = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config/dev.env" });

const app = express();

// Serve React App as static
app.use(express.static(path.join(__dirname, "client/build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/store-message", async (req, res) => {
  const db = getDB();
  const { messages, userId, sessionID } = req.body;
  console.log(messages);

  try {
    const existingSession = await db
      .collection("chatMessages")
      .findOne({ sessionID });

    if (existingSession) {
      // Update existing session
      await db
        .collection("chatMessages")
        .updateOne({ sessionID }, { $set: { messages: messages } });
    } else {
      // Create a new chat session
      await db.collection("chatMessages").insertOne({
        user_id: userId,
        bot_id: "URBAN",
        messages: messages,
        sessionID,
      });
    }

    console.log("Message stored successfully!");
    res.send("Message stored successfully!");
  } catch (error) {
    res.status(500).send("Error storing message: " + error.message);
  }
});

// Fetch all chat messages for the authenticated user
app.get("/fetch-messages/:userId", async (req, res) => {
  const db = getDB();
  const userId = req.params.userId; // Extract userId from URL parameter

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const conversations = await db
      .collection("chatMessages")
      .find({ user_id: userId })
      .sort({ "messages.timestamp": 1 }) // Sorting by timestamp
      .toArray();

    let chatHistory = conversations.map((conv) => {
      return {
        sessionID: conv.sessionID,
        messages: conv.messages,
      };
    });

    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json(chatHistory);
  } catch (error) {
    res.status(500).send("Error fetching messages: " + error.message);
  }
});

// If no API routes are hit, send the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

//  Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Server listener
const apiPort = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(apiPort, () => {
      console.log(`Server running on port ${apiPort}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
