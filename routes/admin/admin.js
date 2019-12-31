const express = require("express");
const router = express.Router();
const winston = require("winston");
let bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
let crypto = require("crypto");
const CircularJSON = require("circular-json");
const axios = require("axios");
const config = require("../../config/settings");
//const config = require('../../config/settings');
let Admin = require("./adminModel");

router.post("/config", async (req, res, next) => {
  let token = (
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization
  ).substring(1);
  try {
    let authentication = await jwt.verify(token, config.secret);
    if (authentication.roles.includes("admin")) {
      var query = { email: "admin.email@gmail.com" },
        update = { expire: new Date(), config: req.body },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

      // Find the document
      Admin.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        res.json({ success: true, response: result.config });
        // do something with the document
      });
    } else {
      res.json({ success: false, response: "Not authenticated" });
    }
  } catch (e) {
    res.json({
      success: false,
      response: "token not authenticated",
      token: token
    });
  }
});
router.get("/getConfig", async (req, res, next) => {
  let token = (
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization
  ).substring(1);
  try {
    let authentication = await jwt.verify(token, config.secret);

    var query = { email: "admin.email@gmail.com" };
    // Find the document
    Admin.find(query, function(error, result) {
      if (error) return;
      res.json({ success: true, response: result });
      // do something with the document
    });
  } catch (e) {
    res.json({ success: false, response: "Data not found" });
  }
});

module.exports = router;
