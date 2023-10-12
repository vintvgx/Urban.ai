const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://vintvgx:BanditNC22@urbanai.9wwis2d.mongodb.net/?retryWrites=true&w=majority";

console.log("🚀 ~ file: db.js:3 ~ uri:", uri);

let db;

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    db = client.db("UrbanAI");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database connection not initialized");
  }
  return db;
};

module.exports = { connectDB, getDB };
