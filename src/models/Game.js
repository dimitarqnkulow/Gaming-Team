const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  platform: {
    type: String,
    required: true,
    enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
  },
  boughtBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
