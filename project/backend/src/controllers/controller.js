const { QueryTypes } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");

exports.default = async (_, res) => {
  res.json({ message: "backend api!" });
};

exports.user = async (req, res) => {
  try {
    const username = req.params.username;
    const messages = await sequelize.query(
      "SELECT messages.* FROM messages WHERE messages.username = :username",
      {
        replacements: { username },
        type: QueryTypes.SELECT,
      }
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.query;
    const query = `
      INSERT INTO users (username, password)
      VALUES (:username, :password);
      `;
    await sequelize.query(query, {
      replacements: { username, password },
      type: QueryTypes.INSERT,
    });
    res.json({ message: "Registered user " + username });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.unregister = async (req, res) => {
  try {
    const { token, password } = req.query;
    const username = jwt.verify(token, "secretkey-edwin").username;
    var query = `
      SELECT password FROM users
      WHERE users.username = :username`;
    const result = await sequelize.query(query, {
      replacements: { username },
      type: QueryTypes.SELECT,
    });
    if (result[0].password == password && result.length > 0) {
      query = `
        DELETE FROM users
        WHERE users.username = :username`;
      await sequelize.query(query, {
        replacements: { username },
        type: QueryTypes.DELETE,
      });
      query = `
        DELETE FROM messages
        WHERE messages.username = :username`;
      await sequelize.query(query, {
        replacements: { username },
        type: QueryTypes.DELETE,
      });
      query = `
        DELETE FROM connections
        WHERE connections.followername = :username 
        OR connections.followingname = :username`;
      await sequelize.query(query, {
        replacements: { username },
        type: QueryTypes.DELETE,
      });
      res.json({ message: "User " + username + " has been unregistered" });
    } else {
      res.json({ message: "User/Password mismatch" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.query;
    const query = `
      SELECT password FROM users 
      WHERE users.username = :username`;
    const result = await sequelize.query(query, {
      replacements: { username },
      type: QueryTypes.SELECT,
    });
    const actualPW = result[0].password;
    if (password != actualPW && result.length > 0) {
      res.json({ success: false });
    } else {
      const token = jwt.sign({ username: username }, "secretkey-edwin");
      res.json(token);
    }
  } catch (error) {
    res.status(500).json({ message: error, token: null });
  }
};

exports.home = async (req, res) => {
  try {
    const { token } = req.query;
    const username = jwt.verify(token, "secretkey-edwin").username;
    console.log(username);
    const query = `
      SELECT messages.*
      FROM messages
      JOIN users ON messages.username = users.username
      JOIN connections ON users.username = connections.followingName
      WHERE connections.followerName = :username;`;
    const messages = await sequelize.query(query, {
      replacements: { username },
      type: QueryTypes.SELECT,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.new = async (req, res) => {
  try {
    const { token, message } = req.query;
    const username = jwt.verify(token, "secretkey-edwin").username;
    const query = `
      INSERT INTO messages (username, message)
      VALUES (:username, :message)`;
    await sequelize.query(query, {
      replacements: { username, message },
      type: QueryTypes.INSERT,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { token, messageID } = req.query;
    const username = jwt.verify(token, "secretkey-edwin").username;
    var query = `
      SELECT username FROM messages 
      WHERE messages.messageid = :messageID`;
    const result = await sequelize.query(query, {
      replacements: { messageID },
      type: QueryTypes.SELECT,
    });
    if (result[0].username == username) {
      query = `
        DELETE FROM messages
        WHERE messages.messageid = :messageID;`;
      await sequelize.query(query, {
        replacements: { messageID },
        type: QueryTypes.DELETE,
      });
      res.json({ message: "Message " + messageID + " deleted" });
    } else {
      res.json({ message: "Token is not message owner" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.follow = async (req, res) => {
  try {
    const { token, followingName } = req.query;
    const followerName = jwt.verify(token, "secretkey-edwin").username;
    const query = `
      INSERT INTO connections (followerName, followingName)
      VALUES (:followerName, :followingName);`;
    await sequelize.query(query, {
      replacements: { followerName, followingName },
      type: QueryTypes.INSERT,
    });
    res.json({ message: followerName + " followed " + followingName });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const { token, followingName } = req.query;
    const followerName = jwt.verify(token, "secretkey-edwin").username;
    const query = `
      DELETE FROM connections
      WHERE followerName = :followerName 
      AND followingName = :followingName;`;
    await sequelize.query(query, {
      replacements: { followerName, followingName },
      type: QueryTypes.DELETE,
    });
    res.json({ message: followerName + " unfollowed " + followingName });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.followstate = async (req, res) => {
  try {
    const { token, followingName } = req.query;
    const followerName = jwt.verify(token, "secretkey-edwin").username;
    const query = `
      SELECT count(1)
      FROM connections 
      WHERE connections.followername = :followerName
      AND connections.followingname = :followingName`;
    const result = await sequelize.query(query, {
      replacements: { followerName, followingName },
      type: QueryTypes.SELECT,
    });
    const state = result[0].count > 0;
    res.json({
      success: state,
      message:
        followerName +
        (state ? " is following " : " is not following ") +
        followingName,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.followtoggle = async (req, res) => {
  try {
    const { token, followingName } = req.query;
    const followerName = jwt.verify(token, "secretkey-edwin").username;
    var query = `
      SELECT count(1)
      FROM connections 
      WHERE connections.followername = :followerName
      AND connections.followingname = :followingName`;
    const result = await sequelize.query(query, {
      replacements: { followerName, followingName },
      type: QueryTypes.SELECT,
    });
    if (result[0].count > 0) {
      query = `
        DELETE FROM connections
        WHERE followerName = :followerName 
        AND followingName = :followingName;`;
      await sequelize.query(query, {
        replacements: { followerName, followingName },
        type: QueryTypes.DELETE,
      });
      res.json({ message: followerName + " unfollowed " + followingName });
    } else {
      query = `
      INSERT INTO connections (followerName, followingName)
      VALUES (:followerName, :followingName);`;
      await sequelize.query(query, {
        replacements: { followerName, followingName },
        type: QueryTypes.INSERT,
      });
      res.json({ message: followerName + " followed " + followingName });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.me = async (req, res) => {
  try {
    const { token } = req.query;
    const username = jwt.verify(token, "secretkey-edwin").username;
    const query = `
      SELECT messages.* FROM messages
      WHERE username = :username`;
    const result = await sequelize.query(query, {
      replacements: { username },
      type: QueryTypes.SELECT,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.users = async (req, res) => {
  try {
    const query = "SELECT users.* FROM users";
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
