const express = require("express");
const { loadModel } = require("./YOLOv8/script");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Pothole = require("./models/Pothole");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// app.use(express.json());

require("dotenv").config();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rnblsxi.mongodb.net/potholes`
);

app.post("/prediction", async (req, res) => {
  const frame = req.body.image;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  console.log("longitude: " + longitude);
  console.log("latitude: " + latitude);
  const coordinates = await loadModel(frame);

  const newPotholeEntry = new Pothole({
    latitude,
    longitude,
    numberOfPotholes: coordinates.length, //  the number of potholes detected
  });

  if (coordinates.length > 0) await newPotholeEntry.save();

  res.send(coordinates);
});

app.get("/getPredictionData", async (req, res) => {
  try {
    const potholes = await Pothole.find();
    res.status(200).json({ potholes });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(3001, () => {
  console.log("Server started");
});
