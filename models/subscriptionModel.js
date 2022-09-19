const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true},
    club: {type: Schema.Types.ObjectId, required: true},
    date_of_subscription: {
        type: Date,
        default: Date.now
    },
    date_of_unsubscription: Date,
    date_of_resubscription: Date,
    options: Schema.Types.Mixed
});

subscriptionSchema.virtual('url').get(() => {
    return `/subscriptions/${this._id}`;
});

module.exports = mongoose.model('Subscription', subscriptionSchema, 'subscriptions');