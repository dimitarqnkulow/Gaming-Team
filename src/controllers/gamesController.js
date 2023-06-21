const { getErrorMessages } = require("../utils/extractErrorMessage");
const router = require("express").Router();
const gamesManager = require("../manager/gamesManager");
const { isAuth } = require("../middleware/authMiddleware");
const { boughtGame } = require("../utils/boughtHelper");
const getPlatformOptions = require("../utils/optionshelper");

//Catalog
router.get("", async (req, res) => {
  const games = await gamesManager.getAll().lean();

  res.render("games/catalog", { games });
});
//Create
router.get("/create", isAuth, (req, res) => {
  res.render("games/create");
});

router.post("/create", isAuth, async (req, res) => {
  const gameData = req.body;
  const ownerId = req.user._id;
  try {
    const newGame = await gamesManager.create({ ...gameData, owner: ownerId });
    res.redirect("/games");
  } catch (err) {
    const errors = getErrorMessages(err);

    res.status(404).render("games/create", { errors });
  }
});

//Details
router.get("/:gameId/details", async (req, res) => {
  const gameId = req.params.gameId;
  const game = await gamesManager.getOne(gameId).populate("owner").lean();
  const isOwner = req.user?._id == game.owner._id;
  const isBought = boughtGame(game.boughtBy, req.user?._id);

  res.render("games/details", { game, isOwner, isBought });
});

//Buy
router.get("/:gameId/buy", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user._id;
  const game = await gamesManager.getOne(gameId).lean();
  const isBought = boughtGame(game.boughtBy, req.user?._id);
  const isOwner = req.user?._id == game.owner._id;

  try {
    if (isBought) {
      throw new Error("Already have been bought!");
    }
    await gamesManager.buy(gameId, userId);
    res.redirect(`/games/${gameId}/details`);
  } catch (error) {
    const errors = getErrorMessages(error);
    res
      .status(404)
      .render(`games/details`, { game, isOwner, isBought, errors });
  }
});

//Edit

router.get("/:gameId/edit", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const game = await gamesManager.getOne(gameId).lean();
  const options = getPlatformOptions(game.platform);
  res.render("games/edit", { game, options });
});
router.post("/:gameId/edit", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const game = req.body;
  const options = getPlatformOptions(game.platform);

  try {
    await gamesManager.update(gameId, game);
    res.redirect(`/games/${gameId}/details`);
  } catch (err) {
    const errors = getErrorMessages(err);
    res.status(404).render("games/edit", { errors, game, options });
  }
});

router.get("/:gameId/delete", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const game = await gamesManager.getOne(gameId).populate("owner").lean();
  const isOwner = req.user?._id == game.owner._id;
  const isBought = boughtGame(game.boughtBy, req.user?._id);
  try {
    await gamesManager.delete("gameId");
    res.redirect("/games");
  } catch (error) {
    res.status(404).render("games/details", {
      game,
      isOwner,
      isBought,
      errors: "Unsuccessful deletion!",
    });
  }
});

module.exports = router;
