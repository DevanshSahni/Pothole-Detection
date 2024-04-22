import "../index.css";
import { useState, useRef } from "react";

import React from "react";

const Dashboard = () => {
  const canvasRef = useRef(null);
  const intervalIDRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [startButton, setStartButton] = useState(true);
  const [detection, setDetection] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dataVisible, setDataVisible] = useState(false);
  const [potholesNum, setPotholeNum] = useState(0);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

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
    setDetection(false);
    // setLoading(false);
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
        setLat(latitude);
        longitude = pos.coords.longitude;
        setLong(longitude);
        sendFrame();
      },
      (err) => {
        alert(err);
        return;
      }
    );
  };

  const addDB = async () => {
    const video = document.getElementById("webcam");
    const constraints = {
      video: true,
    };
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

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addtoDB`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        image: image,
        latitude: lat,
        longitude: long,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    setDataVisible(false);
    alert("Data submitted successfully!");
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
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/prediction`,
        {
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
        }
      );
      const data = await response.json();
      const len = await data.length;
      console.log(await data.length);
      setPotholeNum(len);
      if (data.length > 0) {
        setDataVisible(true);
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
      <h1 className="text-4xl mt-16 mb-3">Smart Pothole Detection</h1>
      <hr className="border border-gray-700 " />
      <p className={`mt-3 ${detection && "hideDisplay"}`}>
        Click on the button below to start detecting the potholes and reportthem
        to nearest administration center
      </p>
      <div className={startButton ? "camNotInView" : "camInView"}>
        <canvas
          className={loading ? "canvas" : "hideDisplay"}
          ref={canvasRef}
        />
        <video
          id="webcam"
          autoPlay
          muted
          className={detection ? "hideDisplay" : "videoView"}
        ></video>
        <div>
          <p className={!detection ? "hideDisplay" : "displayText"}>
            The Pothole/Potholes have been detected. Submitted potholes will be
            reported to the nearest administration center. <br />
            Thankyou for your time!
          </p>
          {dataVisible && (
            <>
              <p>Potholes Detected:-{potholesNum}</p>
              <p>Latitude:- {lat}</p>
              <p>Longitude:- {long}</p>
            </>
          )}
        </div>

        <button
          className={startButton ? "webButton" : "hideDisplay"}
          onClick={enableCam}
        >
          Start Tracking
        </button>

        {dataVisible && (
          <div className="flex gap-5">
            <button
              onClick={() => {
                // enableCam();
                // setDataVisible(false);
                window.location.reload();
              }}
              className="webButton"
            >
              Try Again
            </button>
            <button onClick={addDB} className="webButton">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
