const { Router } = require('express');
const servicesController = require('../controllers/services.controller');

const router = Router();

router.get('/', servicesController.getServices);
router.get('/:id', servicesController.getServicesById);
router.post('/', servicesController.saveService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

module.exports = router;
