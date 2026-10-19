require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

async function sendTelegramMessage(text) {
  await axios.post(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      chat_id: process.env.CHANNEL_ID,
      text,
      disable_web_page_preview: false
    }
  );
}

app.post("/webhook", async (req, res) => {

    console.log("WEBHOOK HIT");

    console.log("HEADERS:");
    console.log(req.headers);
  
    console.log("BODY:");
    console.log(JSON.stringify(req.body, null, 2));


  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (body.challenge) {
    return res.status(200).send(body.challenge);
  }

  if (body.subscription?.type === "stream.online") {
    const streamer = body.event.broadcaster_user_name;
    const login = body.event.broadcaster_user_login;

    await sendTelegramMessage(
      `TEXT="Хейхоу! Домашний, уютный стрим уже в эфире ✨

          🎮 $TITLE

          👉 https://twitch.tv/$TWITCH_USERNAME"`
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