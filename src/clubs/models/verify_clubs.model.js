const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubValidationSchema = new Schema({
  nick: { type: String, required: true },
  name: { type: String, required: true },
  website: { type: String, required: true },
  support_email: { type: String, required: true },
  password: { type: String, required: true },
  date_of_creation: { type: Date, required: true, default: Date.now() },
  topic: {
    type: [{ type: String, required: true }],
    validate: [(val) => val.length >= 3, "Needs to be at least 3 topics"],
  },
});

clubValidationSchema.virtual("url").get(function () {
  return `/unVerifiedClubs/${this._id}`;
});

module.exports = mongoose.model(
  "unVerifiedClubs",
  clubValidationSchema,
  "unVerifiedClubs"
);
