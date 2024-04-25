const { Router } = require('express');

const clientsRoutes = require('./clients.routes');
const refUnitsRoutes = require('./refUnits.routes');
const servicesRoutes = require('./services.routes');
const bodyKitsRoutes = require('./bodyKits.routes');
const bodykitServicesRoutes = require('./bodykitServices.routes');
const pendingTasksRoutes = require('./pendingTasks.routes');
const authRoutes = require('./auth.routes');
const isAuthorized = require('../middleware/auth.middleware');

const { RefUnitsDao, BodyKitsDao } = require('../models/daos/app.daos');

const refUnitsDao = new RefUnitsDao();
const bodyKitsDao = new BodyKitsDao();

const router = Router();

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/signin-error', (req, res) => {
  res.render('pages/signin-error');
});

router.use('/auth', authRoutes);
router.use(isAuthorized);

router.use('/clientes', clientsRoutes);
router.use('/equipos', refUnitsRoutes);
router.use('/servicios', servicesRoutes);
router.use('/carrocerias', bodyKitsRoutes);
router.use('/servicios-carrocerias', bodykitServicesRoutes);
router.use('/tareas', pendingTasksRoutes);

router.get('/', (req, res) => {
  const user = req.user;
  if (!user) {
    res.sendFile('login.html', { root: 'src/public' });
  }
  res.render('pages/home.hbs');
});

router.get('/success', (req, res) => {
  const { body } = req;
  res.render('pages/success', { body });
});

router.get('/busqueda', async (req, res) => {
  const query = req.query.q;
  const refUnits = await refUnitsDao.findByField('plate', query, 'client');
  const bodyKits = await bodyKitsDao.findByField('plate', query, 'client');
  res.render('pages/search-results', { refUnits, bodyKits });
});

module.exports = router;
