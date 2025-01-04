const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { App, ExpressReceiver } = require("@slack/bolt");

// Create an ExpressReceiver
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initialize the Bolt app with the receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
});

// Enable CORS and setup Express app
const expressApp = express();
expressApp.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL if different
  })
);
expressApp.use(bodyParser.json());

// Debugging Middleware
expressApp.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// Slack event: Listen for 'team_join' when a new member joins the workspace
app.event("team_join", async ({ event, client }) => {
  try {
    const userId = event.user.id;
    const userInfo = await client.users.info({ user: userId });
    const userName = userInfo.user.real_name || userInfo.user.name;

    await client.chat.postMessage({
      channel: "#slack_automation_test",
      text: `:wave: Welcome <@${userId}>!`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:wave: Welcome <@${userId}> (${userName})! Your onboarding starts now. Let’s help you get started and connect with other members.`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: Please update your profile and engage with our community.`,
          },
        },
      ],
    });

    console.log(`Welcome message sent to ${userName} (${userId})`);
  } catch (error) {
    console.error("Error handling team_join event:", error);
  }
});

// API: Send welcome message manually
expressApp.post("/api/send-welcome-message", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(
      `Received request to send welcome message to userId: ${userId}`
    );

    const userInfo = await app.client.users.info({ user: userId });
    const userName = userInfo.user.real_name || userInfo.user.name;
    console.log(`Fetched user info: ${userName} (${userId})`);

    await app.client.chat.postMessage({
      channel: "#slack_automation_test",
      text: `:wave: Welcome <@${userId}>!`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:wave: Welcome <@${userId}> (${userName})! Your onboarding starts now. Let’s help you get started and connect with other members.`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: Please update your profile and engage with our community.`,
          },
        },
      ],
    });

    console.log(`Welcome message sent to ${userName} (${userId})`);
    res.status(200).json({ message: "Welcome message sent successfully!" });
  } catch (error) {
    console.error("Error sending welcome message:", error);
    res.status(500).json({
      error: "Failed to send welcome message",
      details: error.message,
    });
  }
});

// API: Send video message
expressApp.post("/api/send-video", async (req, res) => {
  try {
    await app.client.chat.postMessage({
      channel: "#video-test",
      text: `Here are some helpful videos to get you started.`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `1. *Welcome and Introduction*:\n:arrow_right: [Watch Video](https://www.youtube.com/watch?v=ZA7Js3Ibsk0)`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `2. *Setting Up Member Profile*:\n:arrow_right: [Watch Video](https://www.youtube.com/watch?v=bvIUaSUdTGE)`,
          },
        },
      ],
    });

    res.status(200).json({ message: "Video sent successfully!" });
  } catch (error) {
    console.error("Error sending video:", error);
    res.status(500).json({ error: "Failed to send video" });
  }
});

// Start the Express app on port 4000
const port = process.env.PORT || 4000;
expressApp.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
