const express = require("express");
const cors = require("cors");
const db = require("./data/db");

const server = express();

server.use(cors());
server.use(express.json());

server.get("/api/users", getAllUsers);
server.get("*", handleDefault);

function getAllUsers(req, res) {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: "The users information could not be retrieved."
      });
    });
}

function handleDefault(req, res) {
  res.json("it seems to be working");
}

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on " + (process.env.PORT || 3000));
});
