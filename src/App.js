import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import "./App.css";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

const emotions = [
  "Angry",
  "Disgust",
  "Fear",
  "Happy",
  "Sad",
  "Surprise",
  "Neutral"
];

const emotionColors = {
  Angry: "#ef4444",
  Disgust: "#22c55e",
  Fear: "#a855f7",
  Happy: "#facc15",
  Sad: "#3b82f6",
  Surprise: "#f97316",
  Neutral: "#06b6d4"
};

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [emotion, setEmotion] = useState("Initializing...");
  const [confidence, setConfidence] = useState("0%");
  const [probabilities, setProbabilities] = useState({});
  const [history, setHistory] = useState({});
  const [sessionTime, setSessionTime] = useState(0);

  // Initialize history
  useEffect(() => {
    const initialHistory = {};
    emotions.forEach(e => (initialHistory[e] = []));
    setHistory(initialHistory);
  }, []);

  // Load TinyFaceDetector
  useEffect(() => {
    const loadModel = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setModelLoaded(true);
    };
    loadModel();
  }, []);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };
    startCamera();
  }, []);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detection loop
  useEffect(() => {
    if (!modelLoaded) return;

    const interval = setInterval(() => {
      detectFace();
    }, 1000);

    return () => clearInterval(interval);
  }, [modelLoaded]);

  const detectFace = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || video.readyState !== 4) return;

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight
    };

    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!detection) {
      setEmotion("No face detected");
      setConfidence("0%");
      return;
    }

    const box = detection.box;

    // Draw bounding box
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 10;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.shadowBlur = 0;

    // Crop face
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = box.width;
    tempCanvas.height = box.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.drawImage(
      video,
      box.x,
      box.y,
      box.width,
      box.height,
      0,
      0,
      box.width,
      box.height
    );

    tempCanvas.toBlob(async blob => {
      const formData = new FormData();
      formData.append("file", blob);

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/predict",
          formData
        );

        if (!response.data.probabilities) return;

        const probs = response.data.probabilities;

        setEmotion(response.data.emotion);
        setConfidence(
          (response.data.confidence * 100).toFixed(1) + "%"
        );
        setProbabilities(probs);

        // Draw label
        ctx.fillStyle = "#00ff88";
        ctx.font = "18px Arial";
        ctx.fillText(
          `${response.data.emotion} (${(response.data.confidence * 100).toFixed(1)}%)`,
          box.x,
          box.y - 10
        );

        // Update history
        setHistory(prev => {
          const updated = { ...prev };
          emotions.forEach(e => {
            const newArr = [...(updated[e] || []), probs[e] || 0];
            if (newArr.length > 30) newArr.shift();
            updated[e] = newArr;
          });
          return updated;
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  const lineData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: emotions.map(e => ({
      label: e,
      data: history[e] || [],
      borderColor: emotionColors[e],
      borderWidth: 2,
      tension: 0.4
    }))
  };

  const pieData = {
    labels: emotions,
    datasets: [
      {
        data: emotions.map(e => probabilities[e] || 0),
        backgroundColor: emotions.map(e => emotionColors[e])
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Emotion Analytics Dashboard</h1>
        <p>Real-Time AI Emotion Intelligence</p>
      </div>

      <div className="main-card">
        <div style={{ position: "relative", display: "inline-block" }}>
          <video ref={videoRef} autoPlay className="video" />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>

        <div className="emotion-section">
          <h2 style={{ color: emotionColors[emotion] }}>
            {emotion} ({confidence})
          </h2>
          <p>Session Time: {sessionTime}s</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>Emotion Trend (Last 30s)</h3>
          <Line data={lineData} />
        </div>

        <div className="chart-box">
          <h3>Current Emotion Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default App;