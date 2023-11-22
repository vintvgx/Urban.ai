// 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
const OpenAI = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = 3005;

app.use(cors());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log("🚀 ~ file: openai.js:15 ~ app.post ~ message:", message);

  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You respond to queries using urban slang" },
      { role: "user", content: message },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
    temperature: 0.5,
  });

  console.log("🚀 ~ file: openai.js:28 ~ app.post ~ response:", response);
  console.log(
    "🚀 ~ file: openai.js:28 ~ app.post ~ response:",
    response.choices[0].message.content
  );

  // Check if choices array exists and has elements
  if (response.choices && response.choices.length > 0) {
    const messageObject = response.choices[0].message;

    // Check if message object exists
    if (messageObject) {
      const messageContent = messageObject.content;

      console.log(
        "🚀 ~ file: openai.js:28 ~ app.post ~ message content:",
        messageContent
      );
    } else {
      console.log(
        "🚀 ~ file: openai.js:28 ~ app.post ~ No message object found"
      );
    }
  } else {
    console.log(
      "🚀 ~ file: openai.js:28 ~ app.post ~ No choices found in the response"
    );
  }

  res.json({
    message: response.choices[0].message.content,
  });
});

// app.post("/", async (req, res) => {
//   const { message } = req.body;
//   console.log("🚀 ~ file: openai.js:15 ~ app.post ~ message:", message);

//   const response = await openai.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You respond to queries using urban slang from urban dictionary.",
//       },
//       { role: "user", content: message },
//     ],
//     temperature: 1,
//     max_tokens: 256,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//   });

//   console.log("🚀 ~ file: openai.js:28 ~ app.post ~ response:", response);

//   res.json({
//     message: response.data.choices[0].text,
//   });
// });

app.listen(port, () => {
  console.log(`Example app listening`);
});
