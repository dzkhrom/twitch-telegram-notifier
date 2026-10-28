require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

async function getStreamInfo(userId) {

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

  const response = await axios.get(
    `https://api.twitch.tv/helix/streams?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID
      }
    }
  );

  return response.data.data[0];
}

async function sendTelegramMessage(text) {
  await axios.post(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      chat_id: process.env.CHANNEL_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false
    }
  );
}

app.post("/webhook", async (req, res) => {

  console.log("BODY:");
  console.log(JSON.stringify(req.body, null, 2));


  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (body?.challenge) {
    console.log("CHALLENGE RECEIVED:", body.challenge);

    res.set("Content-Type", "text/plain");

    return res.status(200).send(body.challenge);
  }

  if (body.subscription?.type === "stream.online") {
    const streamer = body.event.broadcaster_user_name;
    const login = body.event.broadcaster_user_login;

    const streamInfo = await getStreamInfo(
      body.event.broadcaster_user_id
    );

    await sendTelegramMessage(
      `Хейхоу друзьяшки! Домашний, уютный стрим уже в эфире ✨
🔴 <b>${streamer}</b> уже в эфире!

🎮 ${streamInfo.game_name}
Начинаем сегодня с ${streamInfo.title}
Давай к нам 👉 https://twitch.tv/${login}`
    );
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});