const express = require("express");
const { loadModel } = require("./YOLOv8/script");
const cors = require("cors");
const mongoose=require("mongoose");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// app.use(express.json());

require("dotenv").config();


app.use( 
  cors({
    origin: true,
    credentials: true,
  })
); 

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rnblsxi.mongodb.net/potholes`);

app.post("/prediction", async (req, res) => {
  const frame = req.body.image;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  console.log("longitude: " + longitude);
  console.log("latitude: " + latitude);
  res.send({ output: await loadModel(frame) });
});

app.listen(3001, () => {
  console.log("Server started"); 
});
