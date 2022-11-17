const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const apiRoutes = require("./routers/apiRouter/app.routers");
const pageRoutes = require("./routers/pagesRouter/app.routers");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// View engine
app.set("view engine", "hbs");
app.engine(
  "hbs",
  engine({
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
  })
);
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));
app.use(errorMiddleware);

// Routes
app.use("/", pageRoutes);
app.use("/api", apiRoutes);

module.exports = app;
