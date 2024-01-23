const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

weatherSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    weather: {
      type: Schema.Types.Mixed,
      required: true,
    },
    location: {
      type: locationSchema,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", weatherSchema);
module.exports = User;
