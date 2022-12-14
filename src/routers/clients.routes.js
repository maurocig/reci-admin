const { Router } = require('express');
const clientsController = require('../controllers/clients.controller');

const router = Router();

router.get('/', clientsController.getClients);
router.get('/:id', clientsController.getClientsById);
router.post('/', clientsController.saveClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);
// router.post('/populate', clientsController.populate);

module.exports = router;
