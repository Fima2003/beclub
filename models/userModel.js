const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nick: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    date_of_birth: {type: Date, required: true},
    image: {
        data: Buffer,
        contentType: String
    },
    preferences: {
        type: [{type: String, required: true}],
        validate: [(val) => val.length >= 3, 'Needs to be at least 3 preferences']
    },
    gender: {
        type: String, required: true,
    },
    last_entered: {type: Number, default: Date.now},
    amount_of_subscriptions: {type: Number, default: 0},
    date_of_adding: {type: Date, default: Date.now},
    subscriptions: [{type: Schema.Types.ObjectId}],
});

userSchema.virtual('full_name', function(){
    return `${this.first_name} ${this.last_name}`;
});

userSchema.virtual('recommendations').get( function(){
    // TODO: get array of references to clubs that match user's preferences
    return [];
});

userSchema.virtual('age').get( function(){
    const now = Date.now();
    const birth = this.date_of_birth.getTime();
    return new Date(now).getFullYear() - this.date_of_birth.getFullYear();
});

userSchema.virtual('url').get( function(){
    return `/users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema, 'users');