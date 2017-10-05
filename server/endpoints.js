const express = require('express');

const note = () => {};

const prodServer = express.Router();

prodServer.get("/posts", (req, res) => {
  return res.json();
});

prodServer.post("/posts", (req, res) => {
  return res.json();
});

prodServer.put("/posts", (req, res) => {
  return res.json();
});

prodServer.delete("/posts", (req, res) => {
  return res.json();
});

module.export = prodServer;
