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
app.use(async (req, res, next) => {
    try {
        await client.connect();
        next();
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Connect to MongoDB
client.connect(async (err) => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        return;
    }
    console.log("Connected to MongoDB");
});

// Create or reference your database and collection here
const db = client.db("cluster0");
const usersCollection = db.collection("users");

// **Create** a new user
app.post("/api/users", async (req, res) => {
    try {
        const newUser = req.body; // User data from the request body
        const result = await usersCollection.insertOne(newUser);
        //id = result.insertedId;
        if (result.acknowledged) {
            // Successfully inserted at least one document
            res.status(201).json({
                message: "User created successfully",

            });
        } else {
            // The insertion did not result in any documents being inserted
            throw new Error("User creation failed");
        }
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: err.message });
    }
});







// **Read** all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (err) {
        console.error("Error getting users:", err);
        res.status(500).json({ error: err.message });
    }
});

// **Update** a user
const { ObjectId } = require("mongodb");
app.put("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userObjectId = new ObjectId(userId); // Convert to ObjectId
        const updatedUser = req.body; // Updated user data from the request body

        console.log("Updating user with _id:", userId);
        console.log("New user data:", updatedUser);

        const result = await usersCollection.updateOne({ _id: userObjectId }, { $set: updatedUser });

        console.log("Update result:", result);

        if (result.matchedCount === 1) {
            res.status(200).json({ message: "User updated successfully", user: result.matchedCount });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: err.message });
    }
});


// **Delete** a user

app.delete("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userObjectId = new ObjectId(userId); // Convert to ObjectId
        console.log("Deleting user with _id:", userId);
        console.log("Deleting user with _id:", userObjectId);

        const result = await usersCollection.deleteOne({ _id: userObjectId });
        console.log("Delete result:", result);

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
