const { Router } = require('express');

const clientsRoutes = require('./clients.routes');
const refUnitsRoutes = require('./refUnits.routes');
const servicesRoutes = require('./services.routes');
const bodyKitsRoutes = require('./bodyKits.routes');
const bodykitServicesRoutes = require('./bodykitServices.routes');
const pendingTasksRoutes = require('./pendingTasks.routes');
const authRoutes = require('./auth.routes');
const isAuthorized = require('../middleware/auth.middleware');

const { RefUnitsDao, BodyKitsDao, ServicesDao, ClientsDao } = require('../models/daos/app.daos');

const refUnitsDao = new RefUnitsDao();
const bodyKitsDao = new BodyKitsDao();
const servicesDao = new ServicesDao();
const clientsDao = new ClientsDao();

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
  if (!query) {
    return res.render('pages/search-index');
  }
  const refUnits = await refUnitsDao.findByField('plate', query, 'client');
  const bodyKits = await bodyKitsDao.findByField('plate', query, 'client');
  res.render('pages/search-results', { refUnits, bodyKits, query });
});

router.get('/buscar', async (req, res) => {
  console.log(req.query);
  const { type, field, query } = req.query;
  // const { type, field } = query;
  console.log('tipo: ', type, '\n', 'campo: ', field, 'query: ', query);

  if (!type) {
    return res.redirect('/busqueda');
  }

  if (type === 'equipos') {
    if (field === 'client') {
      const client = await clientsDao.find({ name: query });
      const clientId = client._id;
      const refUnits = await refUnitsDao.find({ client: clientId }, 'client');
    } else {
      const refUnits = await refUnitsDao.findByField(field, query, 'client');
      console.log(refUnits);
      return res.render('pages/search-results', { refUnits, type, field, query });
    }
  }
  if (type === 'carrocerias') {
    const bodyKits = await bodyKitsDao.findByField(field, query, 'client');
    console.log(bodyKits);
    return res.render('pages/search-results', { bodyKits, type, field, query });
  }
  if (type === 'servicios') {
    const services = await servicesDao.findByField(field, query, 'client');
    return res.render('pages/search-results', { services, type, field, query });
  }
  return res.redirect('/busqueda');
});

module.exports = router;
