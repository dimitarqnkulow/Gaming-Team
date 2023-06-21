const Game = require("../models/Game");
const { boughtGame } = require("../utils/boughtHelper");

exports.create = (gameData) => Game.create(gameData);
exports.getOne = (gameId) => Game.findById(gameId);
exports.getAll = () => Game.find();
exports.buy = async (gameId, userId) => {
  const game = await this.getOne(gameId);
  console.log(game.boughtBy);
  if (game.boughtBy.includes(userId)) {
    throw new Error("Product is alredy bought!");
  }
  game.boughtBy.push(userId);

  game.save();
};
exports.update = (gameId, gameData) =>
  Game.findByIdAndUpdate(gameId, gameData, { runValidators: true });

exports.delete = (gameId) => Game.findByIdAndDelete(gameId);
