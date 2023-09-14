const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser"); // To parse JSON request bodies
const { MongoClient } = require("mongodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection setup
const uri = "mongodb+srv://hassanfakih80:kJgq7ZRsZRBgj0jX@cluster0.adyejpk.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// Connect to MongoDB
client.connect(async (err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");

  // Create or reference your database and collection here
  const db = client.db("cluster0");
  const usersCollection = db.collection("users");

  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const newUser = req.body; // User data from the request body
      const result = await usersCollection.insertOne(newUser);
      res.status(201).json({ message: "User created successfully", user: result.ops[0] });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray();
      res.json(users);
    } catch (err) {
      console.error("Error getting users:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
});
