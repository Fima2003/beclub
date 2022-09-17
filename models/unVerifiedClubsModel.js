const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubValidationSchema = new Schema({
    nick: {type: String, required: true},
    name: {type: String, required: true},
    website: {type: String, required: true},
    support_email: {type: String, required: true},
    password: {type: String, required: true},
    price: {type: Number, required: true, min: 0.5, max: 100},
    date_of_creation: {type: Date, required: true, default: Date.now()},
});

clubValidationSchema.virtual('url').get( function(){
    return `/unVerifiedClubs/${this._id}`;
});

module.exports = mongoose.model('unVerifiedClubs', clubValidationSchema, 'unVerifiedClubs');