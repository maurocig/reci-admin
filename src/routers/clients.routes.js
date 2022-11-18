const { Router } = require('express');
const clientsController = require('../controllers/clients.controller');

const router = Router();

router.get('/', clientsController.getClients);
router.get('/nuevo', (req, res) => res.render('pages/clients/new'));
router.get('/:id', clientsController.getClientsById);
router.post('/', clientsController.saveClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

router.post('/:clientId/:refUnitId', clientsController.addRefUnitToClient);
router.delete(
  '/:clientId/:refUnitId',
  clientsController.removeRefUnitFromClient
);

module.exports = router;
