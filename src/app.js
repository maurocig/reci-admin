const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const routes = require('./routers/app.routers');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// View engine
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  engine({
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
  })
);
app.set('views', './src/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
app.use(errorMiddleware);

// Routes
app.use('/', routes);

module.exports = app;
