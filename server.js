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
expressApp.use(cors());
expressApp.use(bodyParser.json());

// Slack event: Listen for 'team_join' when a new member joins the workspace
app.event("team_join", async ({ event, client }) => {
  try {
    const userId = event.user.id; // Get the ID of the new user
    const userInfo = await client.users.info({ user: userId }); // Fetch user information
    const userName = userInfo.user.real_name || userInfo.user.name; // Get user name

    // Send welcome message to the specified channel
    await client.chat.postMessage({
      channel: "#slack_automation_test", // Channel for the welcome message
      text: `:wave: Welcome <@${userId}>!`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:wave: Welcome <@${userId}> (${userName})! We are happy to have you. Your onboarding starts now.\n\nLet’s help you get started and connect with other members well. Your profile must include your personal headshot :busts_in_silhouette: so others can be clear when connecting and introducing others. Also, your description needs to include your marketing superpower :mechanical_arm: as it relates to what you specialize in (focus on one thing). No one likes to refer a "know-it-all" :grin:. See  @U023P5YL0HE or @U03670FRLKY 's profile as examples.`,
            text: `:wave: Welcome <@${userId}> (${userName})! Your onboarding starts now.\n\nLet’s help you get started. See <@U023P5YL0HE> or <@U03670FRLKY>'s profile as examples.`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: Engage and participate in the LIVE Tuesday Broadcast which streams at 8am PT / 11am ET in FB private group, LinkedIn, Twitter, and YouTube via Streamyard.\n\n*Note!!* Streamyard team member “Green room” link will also be shared in the #general channel at least 30 min before we go LIVE!`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: Click the link to watch Giver Marketing Blueprint and post action items in Slack #general channel so everyone can learn about you and give feedback.\n\n<https://www.givermarketing.com/blueprint|Giver Marketing Blueprint>`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: Lastly, if you want to be highlighted as a guest speaker on our Tuesday streams, Register Here.\n\n<https://www.givermarketing.com/tuesday-marketing-broadcast-speaker-registration/|Register here>`,
          },
        },
      ],
    });

    console.log(`Welcome message sent to ${userName} (${userId})`);
  } catch (error) {
    console.error("Error handling team_join event:", error);
  }
});

// Slack event: Listen for manual video trigger
expressApp.post("/api/send-video", async (req, res) => {
  try {
    await app.client.chat.postMessage({
      channel: "#video-test", // Channel for video links
      text: `Here are some helpful videos to get you started.`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `1. *Welcome and Introduction*:\n:arrow_right: [Watch Video](https://www.youtube.com/watch?v=ZA7Js3Ibsk0)\n:white_check_mark: [Schedule Here](https://meetings.hubspot.com/ingrid2)`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `2. *Setting Up Member Profile*:\n:arrow_right: [Watch Video](https://www.youtube.com/watch?v=bvIUaSUdTGE)`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `3. *Getting Showcased*:\n:arrow_right: [Watch Video](https://www.youtube.com/watch?v=vod8x79CVVQ)`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `4. *Team Collaboration*:\n:arrow_right: [Watch Video](https://www.youtube.com/watch?v=hZ7_uf5iyCg)`,
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
const port = 4000;
expressApp.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
