const express = require("express");
const { loadModel } = require("./YOLOv8/script");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.post("/prediction", async (req, res) => {
  const frame = req.body.image;
  res.send({ output: await loadModel(frame) });
});

app.listen(3001, () => {
  console.log("Server started");
});
