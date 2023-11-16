const express = require("express");
const { loadModel } = require("./YOLOv8/script");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.post("/prediction", async (req, res) => {
  const frame = req.body.image;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  console.log("longitude: " + longitude);
  console.log("latitude: " + latitude);
  const coordinates = await loadModel(frame);
  res.send(coordinates);
});

app.listen(3001, () => {
  console.log("Server started");
});
