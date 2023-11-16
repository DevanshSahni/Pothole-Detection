import "./index.css";
import {useState, useRef} from "react"
function App() {
  // let intervalID=null; 
  const intervalIDRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [startButton,setStartButton]=useState(true);
  const [numberOfPothole, setNumberOfPotholes] = useState(0);
  const [loading,setLoading]= useState(false);

  function getUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  const enableCam = async () => {
    setStartButton(false);
    const video = document.getElementById("webcam");
    document.getElementById("webcam").style.display="block";

    if (getUserMediaSupported()) {
      console.log("getUserMedia is supported");
    } else {
      console.log("getUserMedia is not supported");
      return;
    }

    const constraints = {
      video: true,
    };

    try {
      // stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
      // video.srcObject = stream;
      video.srcObject = mediaStreamRef.current;
      await video.play();
      setLoading(true);
        
      intervalIDRef.current=setInterval(async()=>{
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
      setNumberOfPotholes(data.output);
    };
  };
  const stopTracking= ()=>{
    document.getElementById("webcam").style.display="none";
    setStartButton(true);
    setLoading(false);
    clearInterval(intervalIDRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop(); // Release camera access
      });
    }
  }

  return (
    <div className="Container">
      <h1>Smart Pothole Detection</h1>
      <p>Click on the button below to start detecting the potholes and report them to nearest administration center</p>
        <div id="liveView" className={startButton ? "camNotInView" : "camInView"}>
          <video id="webcam" autoPlay muted className={ startButton ? "hideButton"  : "videoView"} ></video>
          <button id="webcamButton" className={ startButton ? "webButton"  : "hideButton"} onClick={enableCam}>
            Start Tracking
          </button>
          { loading && 
          <>
            <p>Potholes Detected : {numberOfPothole}</p>
            <button id="webcamButton" className="webButton" onClick={stopTracking}>
              Stop Tracking
            </button> 
          </> }
        </div>
    </div>
  );
}

export default App;
