const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name: {type: String, required: true},
    nick: {type: String, required: true},
    website: {type: String, required: true},
    date_of_creation: {type: Date, required: true, default: Date.now()},
    support_email: {type: String, required: true},
    password: {type: String, required: true},
    price: {type: Number, required: true, min: 0.5, max: 100},
    profile_image: {type: String, default: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1600"},
    subscriptions: [{type: Schema.Types.ObjectId}],
    posts:  [{type: Schema.Types.ObjectId}],
    comments:  [{type: Schema.Types.ObjectId}],
    propositions: [{type: Schema.Types.ObjectId}],
    profile_image: {
        data: Buffer,
        contentType: String
    }
});

clubSchema.virtual('url').get( function(){
    return `/clubs/${this._id}`;
});

module.exports = mongoose.model('Club', clubSchema, 'clubs');