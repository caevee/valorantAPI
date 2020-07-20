const express = require("express");
const mongoose = require("mongoose");
const { mongosecret } = require(`${__dirname}/secrets.js`);
const capitalize = require(`${__dirname}/util/capitalize.js`);
const port = process.env.PORT || 3000;

// DB Connection

const mongoURL = `mongodb+srv://admin:${mongosecret}@cluster0.y2zzb.mongodb.net/valorantLineupsDB?retryWrites=true&w=majority`;

const app = express();
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Schemes and Models

const agentSchema = new mongoose.Schema({
  name: String,
  id: Number,
  topicThumbnailUrl: String,
  thumbnails: Array,
});

const Agent = mongoose.model("Agent", agentSchema, "agents");

const lineupsSchema = new mongoose.Schema({
  id: Number,
  map: String,
  agent: String,
  title: String,
  url: String,
  description: String,
  tags: Array,
  author: String,
});

const Lineup = mongoose.model("Lineup", agentSchema, "lineups");

// Routings

app.get("/agents", (req, res) => {
  Agent.find({}, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.get("/lineups", (req, res) => {
  let query = {};
  if (req.query.agent) {
    query = { ...query, agent: capitalize(req.query.agent) };
  }
  if (req.query.map) {
    query = { ...query, map: capitalize(req.query.map) };
  }
  Lineup.find(query, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.listen(port, () => {
  console.log("Running on " + port);
});
