const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name: {type: String, required: true},
    nick: {type: String, required: true},
    website: {type: String, required: true},
    date_of_creation: {type: Date, required: true, default: Date.now()},
    support_email: {type: String, required: true},
    password: {type: String, required: true},
    profile_image: {type: String, required: true, default: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1600"},
    type: {type: String, required: true},
    topic: [{type: String}],
    subscriptions: [{type: Schema.Types.ObjectId}],
    promotions: [{type: Schema.Types.ObjectId}],
});

clubSchema.virtual('url').get( function(){
    return `/clubs/${this._id}`;
});

module.exports = mongoose.model('Club', clubSchema, 'clubs');