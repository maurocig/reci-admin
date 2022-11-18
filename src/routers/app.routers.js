const { Router } = require('express');
const clientsRoutes = require('./clients.routes');
const refUnitsRoutes = require('./refUnits.routes');
const servicesRoutes = require('./services.routes');

const router = Router();

router.use('/clientes', clientsRoutes);
router.use('/equipos', refUnitsRoutes);
router.use('/servicios', servicesRoutes);

router.get('/', (req, res) => {
  // res.render('main', { layout: 'index' });
  res.send('homepage');
});

router.get('/success', (req, res) => {
  const { body } = req;
  res.render('pages/success', { body });
});

module.exports = router;
