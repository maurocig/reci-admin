const express = require('express');
const Handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const routes = require('./routers/app.routers');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const { engine } = Handlebars;

// View engine
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  engine({
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    helpers: require('./public/js/formatDate.js'),
  })
);
app.set('views', './src/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
app.use(errorMiddleware);
// put request in html form
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', routes);

module.exports = app;
