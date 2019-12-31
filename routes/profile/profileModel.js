const mongoose = require('mongoose');

let profileSchema = new mongoose.Schema({
    email: { type: String, required: 'email is required' },
    firstName: String,
    lastName: String,
    tel: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    website: String,
    profileEditorContent: String,
    twitter: String,
    google: String,
    facebook: String,
    info: String,
    profileImg: String
});

let Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;

