const { Router } = require('express');
const bodyKitsController = require('../controllers/bodyKits.controller');

const router = Router();

router.get('/search', bodyKitsController.searchBodyKit);
router.get('/filter', bodyKitsController.filterBodyKit);

router.get('/', bodyKitsController.getBodyKits);
// router.get('/nuevo', (req, res) => res.render('pages/bodyKits/new'));
router.get('/nueva/:clientId', bodyKitsController.newBodyKitForm);
router.get('/editar/:bodyKitId', bodyKitsController.editBodyKitForm);
router.get('/:id', bodyKitsController.getBodyKitById);
router.post('/', bodyKitsController.saveBodyKit);
router.put('/:id', bodyKitsController.updateBodyKit);
router.delete('/:id', bodyKitsController.deleteBodyKit);

router.post('/:bodyKitId/:serviceId', bodyKitsController.addServiceToBodyKit);
router.delete('/:bodyKitId/:serviceId', bodyKitsController.removeServiceFromBodyKit);

module.exports = router;
