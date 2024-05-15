const { Router } = require('express');
const mongoose = require('mongoose');

const clientsRoutes = require('./clients.routes');
const refUnitsRoutes = require('./refUnits.routes');
const servicesRoutes = require('./services.routes');
const bodyKitsRoutes = require('./bodyKits.routes');
const bodykitServicesRoutes = require('./bodykitServices.routes');
const pendingTasksRoutes = require('./pendingTasks.routes');
const authRoutes = require('./auth.routes');
const isAuthorized = require('../middleware/auth.middleware');

const {
  RefUnitsDao,
  BodyKitsDao,
  ServicesDao,
  ClientsDao,
  BodykitServicesDao,
} = require('../models/daos/app.daos');

const refUnitsDao = new RefUnitsDao();
const bodyKitsDao = new BodyKitsDao();
const servicesDao = new ServicesDao();
const clientsDao = new ClientsDao();
const bodykitServicesDao = new BodykitServicesDao();

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
  const { type, field, query } = req.query;
  // const { type, field } = query;

  if (!type) {
    // return res.redirect('/busqueda');
    return res.render('pages/search-index');
  }
  if (!query) {
    return res.render('pages/search-index');
  }

  if (type === 'todos') {
    const refUnits = await refUnitsDao.findByField('plate', query, 'client');
    const bodyKits = await bodyKitsDao.findByField('plate', query, 'client');
    return res.render('pages/search-results', { refUnits, bodyKits, query });
  }

  if (type === 'equipos') {
    if (field === 'client') {
      let refUnits = [];
      const clients = await clientsDao.findByField('name', query, 'refUnits');
      clients.forEach(async (client) => {
        client.refUnits.forEach(async (unit) => {
          unit.client = client;
        });
        refUnits.push(...client.refUnits);
      });
      return res.render('pages/search-results', { refUnits, type, field, query });
    } else {
      const refUnits = await refUnitsDao.findByField(field, query, 'client');
      return res.render('pages/search-results', { refUnits, type, field, query });
    }
  }

  if (type === 'carrocerias') {
    if (field === 'client') {
      let bodyKits = [];
      const clients = await clientsDao.findByField('name', query, 'bodyKits');
      clients.forEach(async (client) => {
        client.bodyKits.forEach(async (bodyKit) => {
          bodyKit.client = client;
        });
        bodyKits.push(...client.bodyKits);
      });
      return res.render('pages/search-results', { bodyKits, type, field, query });
    } else {
      const bodyKits = await bodyKitsDao.findByField(field, query, 'client');
      return res.render('pages/search-results', { bodyKits, type, field, query });
    }
  }

  if (type === 'servicios') {
    let services = [];
    let bodykitServices = [];

    if (field === 'client') {
      const clients = await clientsDao.findByField('name', query, 'refUnits');
      const client = clients[0];
      services = await servicesDao.getAllWithRefUnits({ client });
      bodykitServices = await bodykitServicesDao.getAllWithBodykits({ client });
      services.push(...bodykitServices);
      return res.render('pages/search-results', { services, type, field, query });
    } else {
      if (field === 'orderNumber') {
        services = await servicesDao.findNumber({ orderNumber: { $eq: +query } });
        return res.render('pages/search-results', { services, type, field, query });
      } else {
        refUnits = await refUnitsDao.findByField(field, query, 'client');
        refUnits.forEach(async (unit) => {
          // const service = await servicesDao.find({ refUnit: unit._id.toString() });
          unit.services.forEach((service) => {
            service.refUnit = unit;
            service.client = unit.client;
            services.push(service);
          });
        });
        services.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
        return res.render('pages/search-results', { services, type, field, query });
      }
    }
  }

  return res.redirect('/busqueda');
});

module.exports = router;
