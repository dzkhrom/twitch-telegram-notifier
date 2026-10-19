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

  const token = tokenResponse.data.access_token;

  await axios.delete(
    "https://api.twitch.tv/helix/eventsub/subscriptions?id=71161135-2c92-4c11-99e2-c68fa9c5f146",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID
      }
    }
  );

  console.log("Deleted");
}

main().catch(console.error);