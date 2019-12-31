let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
let contactSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  subject: { type: String, required: true },
  message: { type: String }
});

let contact = mongoose.model("contact", contactSchema);
module.exports = contact;
