require("dotenv").config();

const axios = require("axios");

async function main() {
  const tokenResponse = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials"
      }
    }
  );

  const accessToken = tokenResponse.data.access_token;
  console.log("TWITCH_USER_ID =", process.env.TWITCH_BROADCASTER_USER_ID);

  try {
  await axios.post(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      type: "stream.online",
      version: "1",
      condition: {
        broadcaster_user_id: process.env.TWITCH_BROADCASTER_USER_ID
      },
      transport: {
        method: "webhook",
        callback: process.env.WEBHOOK_URL,
        secret: process.env.EVENTSUB_SECRET
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID
      }
    }
  );
}
  catch (error) {
    console.error(error);
  }
  console.log("Subscription created");
}

main();