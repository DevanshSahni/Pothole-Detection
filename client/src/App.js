import "./App.css";

function App() {
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
        
      intervalID=setInterval(async()=>{
        console.log("Here")
        await getPrediction()
      }, 3000);
      
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }

    const getPrediction = async () => {
      // Create a canvas element to capture frames
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match the video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a JPEG image
      const image = canvas.toDataURL("image/jpeg"); 

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
      console.log(data.output);
    };
  };
  const stopTracking= ()=>{
    clearInterval(intervalID);
  }

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
          </button></div>
          <video id="webcam" autoPlay muted></video>
        </div>
      </section>
    </div>
  );
}

export default App;
