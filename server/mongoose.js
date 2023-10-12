const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Define a Mongoose schema and model for Conversations
const conversationSchema = new mongoose.Schema({
  userId: String,
  sessionID: String,
  messages: [Object], // array of message objects
});

const Conversation = mongoose.model("Conversation", conversationSchema);

// Endpoint to save messages
app.post("/store-message", async (req, res) => {
  const { messages, userId, sessionID } = req.body;

  try {
    // Upsert logic: Update if sessionID matches, otherwise create a new entry
    await Conversation.findOneAndUpdate(
      { sessionID: sessionID },
      {
        $setOnInsert: { userId: userId, sessionID: sessionID },
        $set: { messages: messages },
      },
      { upsert: true, new: true }
    );
    res.status(200).send("Chatbot messages saved successfully");
  } catch (error) {
    console.error("Failed to store messages", error);
    res.status(500).send("Failed to store messages");
  }
});

// Endpoint to fetch messages based on sessionID
app.get("/fetch-messages", async (req, res) => {
  const { sessionID } = req.query;

  if (!sessionID) {
    return res.status(400).send("sessionID is required");
  }

  try {
    const conversation = await Conversation.findOne({ sessionID: sessionID });
    if (!conversation) {
      return res.status(404).send("No messages found for the given sessionID");
    }
    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Failed to fetch messages", error);
    res.status(500).send("Failed to fetch messages");
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
