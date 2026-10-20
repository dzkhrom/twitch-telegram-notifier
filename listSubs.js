require("dotenv").config();

const axios = require("axios");

async function main() {
  try {
    console.log("START");

    // Получаем App Access Token
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

    console.log("TOKEN OK");

    const accessToken = tokenResponse.data.access_token;

    // Получаем список EventSub подписок
    const result = await axios.get(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID
        }
      }
    );

    console.log("GET SUBSCRIPTIONS OK");
    console.log(JSON.stringify(result.data, null, 2));

  } catch (error) {
    console.log("ERROR");

    if (error.response?.data) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

main();