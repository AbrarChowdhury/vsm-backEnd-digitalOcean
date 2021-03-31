require("dotenv").config();
const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 8080;
const cors = require("cors");
const Patient = require("./models/patient");
const Bed = require("./models/bed");

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.log("Mongo Connection Error: ", err);
    } else {
      console.log("Mongo Connection established");
    }
  }
);

function saveToDB(bedNumber, message) {
  console.log("save function triggered");
  Bed.findOne({ bedNumber }, (err, { patient }) => {
    if (err) {
      return;
    }
    Patient.findByIdAndUpdate(
      patient,
      { $push: { vitalSigns: message } },
      (err) => {
        if (err) {
          return;
        }
        console.log("stored");
      }
    );
  });
}

const router = require("./router");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

let connection;
const httpServer = http.createServer(app);
const wss = new WebSocket.Server({
  server: httpServer,
});

app.get("/", (req, res) => {
  res.send(`VSM Bioforge ${connection}`);
});

wss.on("connection", function (ws) {
  console.log("new client connected");
  connection = "connected";
  ws.on("close", function () {
    console.log("lost one client");
  });
  ws.on("message", function (message) {
    console.log("Received: " + message);
    console.log("---------------------------");
    //broadcast incoming message to all clients (s.clients)
    if (JSON.parse(message).password == process.env.VSM_PASS) {
      wss.clients.forEach(function (client) {
        if (client != ws && client.readyState) {
          client.send(message);
        }
      });
    } else {
      console.log("un-authorized device");
    }
    console.log("called");
    saveToDB(JSON.parse(message).bedNumber, JSON.parse(message));
  });
});
wss.on("close", () => {
  console.log("client disconnected");
});

httpServer.listen(port, () => console.log(`server listening at port ${port}`));
