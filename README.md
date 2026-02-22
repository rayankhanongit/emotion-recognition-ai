# 🧠 Real-Time Emotion Recognition & Analytics Dashboard

A full-stack AI-powered web application that performs real-time facial emotion recognition using a deep learning model trained on FER-2013 and displays live analytics through a modern React dashboard.

---

## 🚀 Features

* 🎥 Real-time webcam face detection
* 🟢 Live bounding box overlay
* 🤖 CNN-based emotion classification (FER-2013)
* 📊 Multi-emotion trend graph (last 30 seconds)
* 🥧 Live emotion distribution pie chart
* ⏱ Session timer
* ⚡ FastAPI backend for inference
* 🎨 Modern React analytics dashboard
* 🔄 Real-time frontend-backend integration

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React.js
* face-api.js (TinyFaceDetector)
* Chart.js (Analytics visualization)
* Axios

### 🔹 Backend

* FastAPI
* TensorFlow / Keras
* OpenCV
* NumPy

### 🔹 Model

* Custom CNN trained on FER-2013 dataset
* 7 emotion classes:

  * Angry
  * Disgust
  * Fear
  * Happy
  * Sad
  * Surprise
  * Neutral

---

## 📂 Project Structure

emotion-recognition/
│
├── backend/
│   ├── main.py
│   └── models/
│       └── emotion_model.h5
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

---

## 🧠 How It Works

1. Webcam stream is captured in the browser.
2. face-api.js detects face and draws bounding box.
3. Cropped face image is sent to FastAPI backend.
4. Backend processes image using trained CNN model.
5. Emotion probabilities are returned.
6. Frontend displays:

   * Predicted emotion
   * Confidence score
   * Real-time trend graph
   * Distribution pie chart

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/emotion-recognition-ai.git
cd emotion-recognition-ai
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📊 Sample Dashboard

* Real-time emotion detection
* Stable bounding box tracking
* Live analytics visualization

---

## 🎯 Future Improvements

* Deploy backend to cloud (Render / AWS)
* Deploy frontend to Vercel
* Add authentication
* Store emotion history in database
* Generate downloadable session reports
* Improve model accuracy with data augmentation

---

## 📈 Resume Description

Built a full-stack real-time facial emotion recognition system using React.js, FastAPI, and a CNN trained on FER-2013. Implemented webcam-based inference, live analytics visualization, and frontend face detection with bounding box overlay.

---

## 👨‍💻 Author

Rayan Khan
GitHub: https://github.com/rayankhanongit

---

⭐ If you found this project useful, consider starring the repository!
