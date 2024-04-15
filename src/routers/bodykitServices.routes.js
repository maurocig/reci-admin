const { Router } = require('express');
const bodykitServicesController = require('../controllers/bodykitServices.controller');

const router = Router();

router.get('/search', bodykitServicesController.searchServiceByOrder);

router.get('/', bodykitServicesController.getServices);
// router.get('/nuevo', (req, res) => res.render('pages/bodykitServices/new'));
router.get('/nuevo/:bodyKitId', bodykitServicesController.newServiceForm);
router.get('/editar/:serviceId', bodykitServicesController.editServiceForm);
router.get('/:id', bodykitServicesController.getServicesById);
router.post('/', bodykitServicesController.saveService);
router.put('/:id', bodykitServicesController.updateService);
router.delete('/:id', bodykitServicesController.deleteService);

module.exports = router;
