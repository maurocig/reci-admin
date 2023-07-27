const express = require('express');
const Handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const envConfig = require('./config');
const dbConfig = require('./DB/db.config');
const passport = require('./middleware/passport');

const routes = require('./routers/app.routers');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const { engine } = Handlebars;

// View engine
app.set('view engine', 'hbs');
app.set('views', './src/views');
app.engine(
  'hbs',
  engine({
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    helpers: require('./public/js/hbHelpers.js'),
  })
);

app.use(express.static(__dirname + '/public'));
app.use(
  session({
    name: 'user-session',
    secret: envConfig.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 48,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbConfig.mongodb.uri,
      dbName: 'main',
      ttl: 60,
    }),
  })
);
app.use(passport.session());

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
