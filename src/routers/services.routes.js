const { Router } = require('express');
const servicesController = require('../controllers/services.controller');

const router = Router();

router.get('/search', servicesController.searchServiceByOrder);

router.get('/', servicesController.getServices);
router.get('/nuevo', (req, res) => res.render('pages/services/new'));
router.get('/nuevo/:refUnitId', servicesController.newServiceForm);
router.get('/editar/:serviceId', servicesController.editServiceForm);
router.get('/:id', servicesController.getServicesById);
router.post('/', servicesController.saveService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

module.exports = router;
