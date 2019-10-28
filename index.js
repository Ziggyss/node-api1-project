const express = require("express");
const cors = require("cors");
const db = require("./data/db");

const server = express();

server.use(cors());
server.use(express.json());

server.get("/api/users", getAllUsers);
server.get("/api/users/:id", getUserById);
server.get("*", handleDefault);

function getUserById(req, res) {
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "The user information could not be retrieved."
      });
    });
}

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

server.listen(process.env.PORT || 5000, () => {
  console.log("listening on " + (process.env.PORT || 5000));
});
