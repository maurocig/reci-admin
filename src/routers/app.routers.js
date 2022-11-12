const { Router } = require('express');
const clientsRoutes = require('./clients.routes');
const refUnitsRoutes = require('./refUnits.routes');
const servicesRoutes = require('./services.routes');

const router = Router();

router.use('/clientes', clientsRoutes);
router.use('/equipos', refUnitsRoutes);
router.use('/servicios', servicesRoutes);

module.exports = router;
