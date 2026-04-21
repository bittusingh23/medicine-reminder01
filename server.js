/** @format */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.use(bodyParser.json());
app.use(cors());

// 🔑 Twilio credentials (APNE DALNA)~
const accountSid = "ACabe02b85e8e6d25e80a96c8282ce1523";
const authToken = "c172143315f2173426e2a2c27943d488";

const client = new twilio(accountSid, authToken);

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
        to: "whatsapp:+918809454240",
      })
      .then(() => console.log("WhatsApp sent"))
      .catch((err) => console.log(err));
  }, delay);

  res.send("Reminder set");
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend chal raha hai 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
