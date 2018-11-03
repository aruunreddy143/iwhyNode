const mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({
    email: { type: String, required: 'email is required' },
    config: { type: Object },
    roles: { type: Object }
});

let Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;

