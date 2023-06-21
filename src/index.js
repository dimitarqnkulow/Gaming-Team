const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const routes = require("./routes");
const { auth } = require("./middleware/authMiddleware");

const app = express();

const PORT = 3000;

//Configure express
app.use(express.static(path.join(__dirname, "./", "public")));
app.use(express.urlencoded({ extended: false }));

//Configure handlebars
app.engine("hbs", handlebars.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "src/views");

//Configure mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/gaming-team")
  .then(() => {
    console.log("DB connected sucessfully");
  })
  .catch((err) => {
    console.log(`DB error: ${err}`);
  });

//Configure cookie-parser
app.use(cookieParser());

//Authentication
app.use(auth);
app.use(routes);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
