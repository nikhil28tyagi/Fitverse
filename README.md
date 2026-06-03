# Fitverse AI — Live Smart Trainer & Posture Analytics Engine

Fitverse is an AI-powered, client-side home fitness ecosystem engineered to eliminate manual workout tracking fatigue and physical form evaluation limitations. By mapping high-precision computer vision frameworks directly onto an interactive, glassmorphic HUD dashboard, the platform tracks physical performance and executes biometric calculation pipelines natively inside the web browser.

---

## 🚀 Key Architectural Features

* **Biometric Coordinate Mapping:** Leverages Google's **MediaPipe BlazePose** engine to track 33 3D skeletal landmark coordinates in real-time.
* **Vector Joint-Angle Calculation:** Implements coordinate geometry and trigonometric vector analysis to calculate precise real-time joint-extension angles (e.g., elbow flexion boundaries during arm movements).
* **Algorithmic Repetition Tracking:** Utilizes an asynchronous state-machine pipeline to systematically evaluate directional movement states, automatically registering valid, completed repetitions.
* **On-Device Privacy Engine:** Processes all inference computational sequences strictly on the user's local machine, ensuring raw video streams are immediately dropped post-inference and never transmitted across external servers.
* **Sleek Glassmorphic Interface:** Features a responsive, cyber-style HUD dark theme optimized with CSS grid styling and emissive neon accent shadows.

---

## 🛠️ Technology Stack & Dependencies

* **Frontend Layout:** HTML5, CSS3 (Custom Grid Layouts, Glassmorphic Transparency Layers, and CSS Root Variables)
* **Logic/Pipeline Execution:** Vanilla ECMAScript 6 (JavaScript)
* **Computer Vision Pipeline:** * `@mediapipe/pose` (BlazePose Framework Core Topology)
  * `@mediapipe/camera_utils` (Local Webcam Capture Streaming Controls)
  * `@mediapipe/drawing_utils` (Canvas Coordinate Node Overlay Rendering)

---

## 📂 File Organization & Structure

```text
fitverse/
├── index.html       # Structural layout, UI dashboard wrappers, and MediaPipe CDN scripts.
├── styles.css       # Deep dark-mode styles, neon shadow aesthetics, and glassmorphism styling.
├── script.js        # Mathematical vector angle calculations and finite state repetition counting.
└── README.md        # Technical platform architecture definition and documentation.
