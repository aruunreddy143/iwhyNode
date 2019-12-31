const express = require("express");
const router = express.Router();
let Contact = require("./ContactModel");

router.post("/", (req, res, next) => {
  console.log(req.body);
  var contact = new Contact(req.body);

  contact.save(function(err) {
    if (err) {
      res
        .status(500)
        .send({ success: false, error: err, message: "problem encounterd" });
      return;
    }
    res.send({ success: true, message: "Data saved successfully" });
  });
});

module.exports = router;
