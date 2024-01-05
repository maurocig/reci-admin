const { Router } = require('express');
const clientsController = require('../controllers/clients.controller');

const router = Router();

router.get('/search', clientsController.searchClient);

router.get('/', clientsController.getClientsSorted);
router.get('/nuevo', clientsController.getClientsForm);
router.get('/:id', clientsController.getClientsById);
router.post('/', clientsController.saveClient);
router.get('/editar/:id/', clientsController.editClientsById);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

router.post('/:clientId/:refUnitId', clientsController.addRefUnitToClient);
router.delete('/:clientId/:refUnitId', clientsController.removeRefUnitFromClient);

module.exports = router;
