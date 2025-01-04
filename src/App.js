import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);

  const sendWelcomeMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/send-welcome-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: "U123456" }), // Replace with an actual test user ID
        }
      );
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Response error details:", errorDetails);
        throw new Error(errorDetails.error || "Unknown error");
      }
      alert("Welcome message sent successfully to #slack_automation_test!");
    } catch (error) {
      console.error("Error sending welcome message:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendVideo = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/send-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Response error details:", errorDetails);
        throw new Error(errorDetails.error || "Unknown error");
      }
      alert("Video sent successfully to #video-test!");
    } catch (error) {
      console.error("Error sending video:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <button onClick={sendWelcomeMessage} disabled={loading}>
        Send Welcome Message
      </button>
      <button onClick={sendVideo} disabled={loading}>
        Send Video
      </button>
    </div>
  );
};

export default App;
