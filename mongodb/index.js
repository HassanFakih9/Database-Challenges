const express = require("express");
const app = express();

const port = 5000;

const cors = require("cors");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/api', (req, res) => {
    res.send('Hello, this is your Express API! number 2');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
  
const { MongoClient, ServerApiVersion, Admin } = require('mongodb');
const uri = "mongodb+srv://hassanfakih80:kJgq7ZRsZRBgj0jX@cluster0.adyejpk.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);


