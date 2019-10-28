const express = require("express");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json());

server.get("*", handleRequest);

function handleRequest(req, res) {
  res.json("it seems to be working");
}

server.listen((process.env.PORT || 3000), () => {
  console.log("listening on " + (process.env.PORT || 3000));
});
