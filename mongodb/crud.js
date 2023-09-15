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
// Middleware to check connection status


// Connect to MongoDB

client.connect(async (err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err); // Log the error
    return;
  }
  console.log("Connected to MongoDB");

  // ... Rest of your code
});

// Create or reference your database and collection here
const db = client.db("cluster0");
const usersCollection = db.collection("users");

// **Create** a new user

app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body; // User data from the request body
    const result = await usersCollection.insertOne(newUser);

    if (result.acknowledged && result.ops && result.ops.length > 0) {
      // Successfully inserted at least one document
      res.status(201).json({
        message: "User created successfully",
        user: result.ops[0]
      });
    } else {
      // The insertion did not result in any documents being inserted
      res.status(500).json({ error: "User creation failed" });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// **Read** all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **Update** a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body; // Updated user data from the request body
    const result = await usersCollection.updateOne({ _id: userId }, { $set: updatedUser });
    res.status(200).json({ message: "User updated successfully", user: result.matchedCount });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//**Delete** a user
app.delete("/api/users/:_id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await usersCollection.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted successfully", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});


