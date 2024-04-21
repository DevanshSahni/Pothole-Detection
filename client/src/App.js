import "./index.css";
import { useState, useRef } from "react";
function App() {
  const canvasRef = useRef(null);
  const intervalIDRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [startButton, setStartButton] = useState(true);
  const [detection,setDetection] = useState(false);
  const [loading, setLoading] = useState(false);
  let latitude, longitude;
  const getUserMediaSupported = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  const enableCam = async () => {
    setStartButton(false);
    document.getElementById("webcam").style.display = "block";
    if (await getUserMediaSupported()) {
      console.log("getUserMedia is supported");
    } else {
      console.log("getUserMedia is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        sendFrame();
      },
      (err) => {
        alert(err);
        return;
      }
    );
  };

  const sendFrame = async (event) => {
    const video = document.getElementById("webcam");
    const constraints = {
      video: true,
    };

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      // video.srcObject = stream;
      video.srcObject = mediaStreamRef.current;
      await video.play();
      setLoading(true);

      intervalIDRef.current = setInterval(async () => {
        console.log("Here");
        await getPrediction();
      }, 3000);
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/prediction`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          image: image,
          latitude: latitude,
          longitude: longitude,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(await data.length);
      if(data.length>0)
      {
        ctx.drawImage(video, 0, 0, hiddencanvas.width, hiddencanvas.height);
        // Draw the bounding boxes for the detected potholes
        data.forEach((pothole) => {
          const [x1, x2, y1, y2] = pothole;
          ctx.beginPath();
          ctx.rect(x1, y1, x2 - x1, y2 - y1);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "red";
          ctx.stroke();
        });
        stopTracking();
      }
    };
  };
  const stopTracking = () => {
    clearInterval(intervalIDRef.current);
    setDetection(true);
  };

  return (
    <div className="Container">
      <h1>Smart Pothole Detection</h1>
      <p className={detection && "hideDisplay"}>Click on the button below to start detecting the potholes and reportthem to nearest administration center</p>
      <div className={startButton ? "camNotInView" : "camInView"}>
        <canvas className={loading ? "canvas": "hideDisplay"} ref={canvasRef} />
        <video id="webcam" autoPlay muted className={detection ? "hideDisplay" : "videoView"}></video>
        <p className={!detection ? "hideDisplay" : "displayText" }>Potholes have been detected and stored to the database. Thankyou for your time.</p>
        <button className={startButton ? "webButton" : "hideDisplay"} onClick={enableCam}>Start Tracking</button>
      </div>
    </div>
  );
}

export default App;
