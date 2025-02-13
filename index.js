const express = require("express");
const cors = require("cors");
const db = require("./data/db");

const server = express();

server.use(cors());
server.use(express.json());

server.get("/api/users", getAllUsers);
server.get("/api/users/:id", getUserById);
server.post("/api/users", postNewUser);
server.delete("/api/users/:id", deleteUser);
server.put("/api/users/:id", updateUser);
server.get("*", handleDefault);

function updateUser(req, res) {
  const { id } = req.params;
  const user = req.body;

  if (!id) {
    res.status(404).json({
      success: false,
      message: "The user with the specified ID does not exist."
    });
  } else if (!user.name || !user.bio) {
    res.status(400).json({
      success: false,
      message: "Please provide name and bio for the user"
    });
  } else {
    db.update(id, user)
      .then(updated => {
        res.status(200).json({
          success: true,
          message: "User updated",
          updated
        });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          message: "The user information cound not be modified."
        });
      });
  }
}

function deleteUser(req, res) {
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
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
        message: "The user could not be removed"
      });
    });
}

function postNewUser(req, res) {
  const userInfo = {
    name: req.body.name,
    bio: req.body.bio
  };

  if (!userInfo.name || !userInfo.bio) {
    res.status(404).json({
      success: false,
      message: "Please provide name and bio for the user."
    });
  }

  db.insert(userInfo)
    .then(userInfo => {
      res.status(201).json({
        success: true,
        userInfo
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "There was an error while saving the user to the database"
      });
    });
}

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
