const router = require("express").Router();
const authManager = require("../manager/authManager");
const { isAuth } = require("../middleware/authMiddleware");
const { getErrorMessages } = require("../utils/extractErrorMessage");

//Register
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, repeatPassword } = req.body;
    const token = await authManager.register({
      username,
      email,
      password,
      repeatPassword,
    });
    res.cookie("auth", token, { httpOnly: true });
    res.redirect("/");
    return newUser;
  } catch (error) {
    const errors = getErrorMessages(error);

    res.status(404).render("auth/register", { errors });
  }
});

//Login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authManager.login(email, password);

    res.cookie("auth", token, { httpOnly: true });

    res.redirect("/");
  } catch (error) {
    const errors = getErrorMessages(error);
    res.status(404).render("auth/login", { errors });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});
module.exports = router;
