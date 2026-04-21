/** @format */

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
const path = require("path");

const app = express(); 

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname));


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

// API route
app.post("/set-reminder", (req, res) => {
  const { medicine, time } = req.body;

  const now = new Date();
  const reminderTime = new Date();

  const [hour, minute] = time.split(":");

  reminderTime.setHours(parseInt(hour));
  reminderTime.setMinutes(parseInt(minute));
  reminderTime.setSeconds(0);
  reminderTime.setMilliseconds(0);

  let delay = reminderTime.getTime() - now.getTime();

  if (delay <= 0) {
    delay += 24 * 60 * 60 * 1000;
  }

  console.log("Reminder in", delay / 1000, "seconds");

  setTimeout(() => {
    client.messages
      .create({
        body: `Time to take ${medicine}`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+91XXXXXXXXXX", // 👈 apna number daalo
      })
      .then(() => console.log("WhatsApp sent"))
      .catch((err) => console.log(err));
  }, delay);

  res.send("Reminder set");
});

// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
