// Description: Backend server for the application


const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cors = require("cors");
app.use(cors());  
const PORT = 4000;

const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get('/', (req, res) => {
  res.send('Hello world');
});


app.get("/status", (req, res) => {
    res.send("check Status");
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})