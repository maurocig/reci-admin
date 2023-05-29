const { Router } = require('express');

const clientsRoutes = require('./clients.routes');
const refUnitsRoutes = require('./refUnits.routes');
const servicesRoutes = require('./services.routes');
const pendingTasksRoutes = require('./pendingTasks.routes');
const authRoutes = require('./auth.routes');
const isAuthorized = require('../middleware/auth.middleware');

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
router.use('/pendientes', pendingTasksRoutes);

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

module.exports = router;
