const tf = require("@tensorflow/tfjs-node");
const sharp = require("sharp");
const modelPath = "./YOLOv8/best_web_model/model.json";
const imagePath = "./images/pothole6.jpg";
let model;

// Load the custom trained model in tensorflow.js
async function loadModel(frame) {
  model = await tf.loadGraphModel(`file://${modelPath}`);
  return (await predict(frame));
}

// Preprocess the image/frame
async function preprocessImage(image, imgWidth, imgHeight) {
  // Decode image data
  const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  // to extract the original metadata of input image
  const img = sharp(imageBuffer);
  const metaData = await img.metadata();
  imgWidth = metaData.width;
  imgHeight = metaData.height;

  // Process the image
  const resizedImage = await sharp(imageBuffer).resize(640, 640).toBuffer();
  const imageTensor = tf.node.decodeImage(resizedImage);
  const normalizedTensor = imageTensor.div(tf.scalar(255));
  const expandedTensor = normalizedTensor.expandDims(0);
  return expandedTensor;
}

// Predict if given image has Potholes.
async function predict(image) {
  let imgWidth, imgHeight;
  const inputTensor = await preprocessImage(image, imgWidth, imgHeight);

  // Perform inference (prediction)
  const outputTensor = await model.execute(inputTensor);
  const tensorArray = await outputTensor.array();
  const output = await tensorArray[0];

  return postprocess(output, imgWidth, imgHeight);
}

// Postprocess output data
function postprocess(output, imgWidth, imgHeight) {
  const boxes = [];

  // All boxes surrounding potholes
  for (let i = 0; i < 8400; i++) {
    const xCenter = output[0][i];
    const yCenter = output[1][i];
    const width = output[2][i];
    const height = output[3][i];
    const probability = output[4][i];

    //To calculate coordinates of bounding box corners
    const x1 = ((xCenter - width / 2) / 640) * imgWidth;
    const y1 = ((yCenter - height / 2) / 640) * imgHeight;
    const x2 = ((xCenter + width / 2) / 640) * imgWidth;
    const y2 = ((yCenter + height / 2) / 640) * imgHeight;

    if (probability > 0.5) {
      boxes.push([x1, x2, y1, y2, probability]);
    }
  }

  const threshold = 0.7; // Adjust the threshold as needed
  const selectedBoxes = nonMaxSuppression(boxes, threshold);

  return selectedBoxes.length;
}

// Return the remaining boxes after performing suppression
function nonMaxSuppression(boxes, threshold) {
  const resultBoxes = [];

  for (let i = 0; i < boxes.length; i++) {
    let includeBox = true;

    for (let j = 0; j < resultBoxes.length; j++) {
      const iou = calculateIoU(boxes[i], resultBoxes[j]);

      if (iou >= threshold) {
        // If the IoU is greater than or equal to the threshold, keep only one box with higher probability
        includeBox = false;
        if (resultBoxes[j][4] > boxes[i][4]) {
          resultBoxes[j] = boxes[i];
        }
        break;
      }
    }

    if (includeBox) {
      resultBoxes.push(boxes[i]);
    }
  }

  return resultBoxes;
}

// Calculate area of intersection between two boxes
function calculateIoU(box1, box2) {
  const x1 = Math.max(box1[0], box2[0]);
  const y1 = Math.max(box1[2], box2[2]);
  const x2 = Math.min(box1[1], box2[1]);
  const y2 = Math.min(box1[3], box2[3]);

  const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const box1Area = (box1[1] - box1[0]) * (box1[3] - box1[2]);
  const box2Area = (box2[1] - box2[0]) * (box2[3] - box2[2]);

  const unionArea = box1Area + box2Area - intersectionArea;

  return intersectionArea / unionArea;
}

// loadModel();
module.exports = { loadModel };
