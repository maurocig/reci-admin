const express = require('express');
const Handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { google } = require('googleapis');
const multer = require('multer');
const stream = require('stream');

const envConfig = require('./config');
const dbConfig = require('./DB/db.config');
const passport = require('./middleware/passport');

const routes = require('./routers/app.routers');
const errorMiddleware = require('./middleware/error.middleware');
const upload = multer();
const { ServicesDao, RefUnitsDao } = require('./models/daos/app.daos');
const servicesController = require('./controllers/services.controller.js');

const app = express();
const { engine } = Handlebars;
const servicesDao = new ServicesDao();
const refunitsDao = new RefUnitsDao();

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
// put request in html form
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ATTACHMENTS UPLOAD
// const KEYFILEPATH = 'cred.json';
const KEYFILEPATH = 'google-api-credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

app.post('/upload', upload.any(), async (req, res) => {
  const { serviceId, refunitId } = req.body;
  try {
    const { files } = req;
    const filesResponse = [];

    for (let f = 0; f < files.length; f += 1) {
      let driveFolder;
      if (serviceId) {
        driveFolder = process.env.SERVICES_UPLOAD_FOLDER;
      } else if (refunitId) {
        driveFolder = process.env.REFUNITS_UPLOAD_FOLDER;
      } else {
        console.error('Error al subir archivo: no se especificó el serviceId o refUnitId.');
      }
      const data = await uploadFile(files[f], driveFolder);
      const file = { name: data.name, id: data.id };
      filesResponse.push(file);
    }

    if (serviceId) {
      const updatedService = await servicesDao.addAttachments(serviceId, filesResponse);
    } else if (refunitId) {
      const updatedRefunit = await refunitsDao.addAttachments(refunitId, filesResponse);
    }
    res.json({ serviceId, refunitId });
  } catch (e) {
    res.send(e.message);
  }
});

// Routes
app.use('/', routes);

module.exports = app;

app.use(errorMiddleware);

// upload files to google drive (services)
const uploadFile = async (fileObject, folder) => {
  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: 'v3', auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: [folder],
      },
      fields: 'id,name,mimeType',
    });

    console.log(`Uploaded file ${data.name} ${data.id} ${data.mimeType}`);
    return data;
  } catch (e) {
    console.error('Error al subir archivo: ', e);
  }
};

// upload files to google drive (refUnits)
