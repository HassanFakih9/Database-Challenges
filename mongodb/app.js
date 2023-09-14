const express = require("express");
const app = express();

const port = 5000;

const cors = require("cors");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/api', (req, res) => {
    res.send('Hello, this is your Express API!');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });