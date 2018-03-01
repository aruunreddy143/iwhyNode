let mongoose = require('mongoose');

var Schema = mongoose.Schema;

var giveAssistanceSchema = new Schema({
    email: String,
    date: { type: Date, default: Date.now },
    from: String,
    flights:Array,
    to:String,
    name: { type: String, required: true, unique: true },
    tel: { type: String, required: true },
    message: String,
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
giveAssistanceSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

// the schema is useless so far
// we need to create a model using it
var GiveAssistance = mongoose.model('GiveAssistance', giveAssistanceSchema);

// make this available to our users in our Node applications
module.exports = GiveAssistance;