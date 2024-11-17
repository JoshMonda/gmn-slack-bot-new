import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);

  // Function to send welcome message
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
          body: JSON.stringify({ userId: "U123456" }), // Replace 'U123456' with a test user ID
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send welcome message");
      }
      alert("Welcome message sent successfully to #slack_automation_test!");
    } catch (error) {
      console.error("Error sending welcome message:", error);
      alert("Error sending welcome message");
    } finally {
      setLoading(false);
    }
  };

  // Function to send video
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
        throw new Error("Failed to send video");
      }
      alert("Video sent successfully to #video-test!");
    } catch (error) {
      console.error("Error sending video:", error);
      alert("Error sending video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Slack Bot Control Panel</h1>
      <div className="button-group">
        <button onClick={sendWelcomeMessage} disabled={loading}>
          {loading ? "Sending Welcome Message..." : "Send Welcome Message"}
        </button>
        <button onClick={sendVideo} disabled={loading}>
          {loading ? "Sending Video..." : "Send Video"}
        </button>
      </div>
    </div>
  );
};

export default App;
