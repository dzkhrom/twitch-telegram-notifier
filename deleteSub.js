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
    "https://api.twitch.tv/helix/eventsub/subscriptions?id=14f5067b-7b6e-4d78-a07a-97172987a06f",
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