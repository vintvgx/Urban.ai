const express = require("express");

const { connectDB, getDB } = require("./db");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const apiPort = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(apiPort, async () => {
  await connectDB();
  console.log(`Server running on port ${apiPort}`);
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

// app.post("/store-message", async (req, res) => {
//   const db = getDB();
//   const { messages, userId, session_id } = req.body; // Ensure you're getting the session_id

//   console.log("store message called");

//   try {
//     const result = await db.collection("chatConversations").updateOne(
//       { userId, bot_id: "CLAUDE", "messages.session_id": session_id },
//       {
//         $set: { messages: messages },
//       },
//       { upsert: true } // This option will insert a new conversation if one with the given session_id doesn't exist
//     );

//     if (result.matchedCount === 0) {
//       // Handle the case where no document matched the filter
//       await db.collection("chatConversations").insertOne({
//         userId,
//         bot_id: "CLAUDE",
//         messages: messages,
//       });
//     }

//     console.log("Message stored successfully!");
//     res.send("Message stored successfully!");
//   } catch (error) {
//     res.status(500).send("Error storing message: " + error.message);
//   }
// });

// Fetch all chat messages for the authenticated user
app.get("/fetch-messages", async (req, res) => {
  const db = getDB();

  // If user not authenticated
  // if (!req.user) {
  //   return res.status(401).send("Unauthorized");
  // }

  try {
    const messages = await db
      .collection("chatMessages")
      .find({ userId: req.user._id })
      .toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).send("Error fetching messages: " + error.message);
  }
});

// A route to insert a sample document into the "test" collection
app.post("/insert-test", async (req, res) => {
  const db = getDB();
  try {
    await db
      .collection("test")
      .insertOne({ name: "Sample", timestamp: new Date() });
    res.send("Document inserted successfully!");
  } catch (error) {
    res.status(500).send("Error inserting document: " + error.message);
  }
});

// A route to fetch all documents from the "test" collection
app.get("/fetch-test", async (req, res) => {
  const db = getDB();
  try {
    const documents = await db.collection("test").find({}).toArray();
    res.json(documents);
  } catch (error) {
    res.status(500).send("Error fetching documents: " + error.message);
  }
});
