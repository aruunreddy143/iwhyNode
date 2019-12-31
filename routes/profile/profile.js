const express = require("express");
const router = express.Router();
const tokenVerify = require("../../auth/verifytoken");
var winston = require("../../config/winston");

const Profile = require("./profileModel");
const User = require("../users/userModel");

router.get("/", (req, res, next) => {
  Profile.find({}, (err, data) => {
    if (err) {
      res
        .status(500)
        .send({ success: false, error: err, message: "problem encounterd" });
    }
    res.json({ success: true, data: data });
  });
});
router.post("/getProfile", tokenVerify, (req, res, next) => {
  Profile.findOne({ email: req.body.email }, (err, data) => {
    console.log(err);
    if (!err && err === null) {
      res.json({ success: true, data: data });
    }
    res
      .status(500)
      .send({ success: false, error: err, message: "Details not found" });
  });
});
router.post("/updateImg", (req, res, next) => {
  Profile.findOneAndUpdate(
    { email: req.body.email },
    { $set: { profileImg: req.body.profileImg } },
    { new: true },
    (err, data) => {
      console.log(err);
      if (!err && err === null) {
        res.json({ success: true, data: data });
      }
      res
        .status(500)
        .send({ success: false, error: err, message: "Details not found" });
    }
  );
});

router.post("/", async (req, res, next) => {
  let profile = new Profile(req.body);
  let user;
  try {
    user = await User.findOne({ email: req.body.email });

    if (user !== null) {
      if (await Profile.findOne({ email: req.body.email })) {
        Profile.findOneAndUpdate(
          { email: req.body.email },
          req.body,
          { returnNewDocument: true, new: true },
          (err, data) => {
            res.json({ success: true, message: "data update", data: data });
          }
        );
      } else {
        profile.save((err, data) => {
          if (err) {
            winston.error(err);
            res.status(500).send({
              success: false,
              error: err,
              message: "problem encounterd"
            });
          }
          winston.info({ success: true, message: "New data saved" });
          res.json({ success: true, message: "New data saved", data: data });
        });
      }
    } else {
      winston.error({ success: false, message: "problem encounterd" });
      res.status(500).send({ success: false, message: "problem encounterd" });
    }
  } catch (e) {
    winston.error("New data saved");
    res.status(500).send({
      success: false,
      error: user,
      message: "problem encounterd catched"
    });
  }
});
module.exports = router;
