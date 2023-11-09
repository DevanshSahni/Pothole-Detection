import React, { useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);

  let intervalID;
  function getUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  const enableCam = async (event) => {
    const video = document.getElementById("webcam");

    if (getUserMediaSupported()) {
      console.log("getUserMedia is supported");
    } else {
      console.log("getUserMedia is not supported");
      return;
    }

    const constraints = {
      video: true,
    };
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      await video.play();

      intervalID = setInterval(async () => {
        console.log("Here");
        await getPrediction();
      }, 1000);
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }

    const getPrediction = async (timestamp) => {
      // Create a canvas element to capture frames
      const hiddencanvas = document.createElement("canvas");
      const hiddenctx = hiddencanvas.getContext("2d");
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match the video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      hiddencanvas.width = video.videoWidth;
      hiddencanvas.height = video.videoHeight;

      // Draw the video frame on the canvas
      hiddenctx.drawImage(video, 0, 0, hiddencanvas.width, hiddencanvas.height);

      // Convert the canvas content to a JPEG image
      const image = hiddencanvas.toDataURL("image/jpeg");

      //Send the 'image' data to server for further processing.
      const response = await fetch("http://localhost:3001/prediction", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          image: image,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);

      // Draw the bounding boxes for the detected potholes
      data.forEach((pothole) => {
        const [x1, x2, y1, y2] = pothole;
        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.stroke();
      });
    };
  };
  const stopTracking = () => {
    clearInterval(intervalID);
  };

  return (
    <div className="Container">
      <h1>
        Multiple object detection using pre trained model in TensorFlow.js
      </h1>

      <p>
        Wait for the model to load before clicking the button to enable the
        webcam - at which point it will become visible to use.
      </p>

      <section id="demos" className="invisible">
        <p>
          Hold some objects up close to your webcam to get a real-time
          classification! When ready click "enable webcam" below and accept
          access to the webcam when the browser asks (check the top left of your
          window)
        </p>

        <div id="liveView" className="camView">
          <div>
            <button id="webcamButton" onClick={enableCam}>
              Start Tracking
            </button>
            <button id="webcamButton" onClick={stopTracking}>
              Stop Tracking
            </button>
          </div>
          <canvas className="canvas" ref={canvasRef} />
          <video id="webcam" autoPlay muted></video>
        </div>
      </section>
    </div>
  );
}

export default App;
