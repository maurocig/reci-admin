const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.render('pages/clients', { layout: 'index' });
});

router.get('/nuevo', (req, res) => {
  res.render('pages/clients/new', { layout: 'index' });
});

// router.get('/:id', clients.getRefUnitsById);
// router.post('/', clients.saveRefUnit);
// router.put('/:id', clients.updateRefUnit);
// router.delete('/:id', clients.deleteRefUnit);

// router.post('/:refUnitId/:serviceId', clients.addServiceToRefUnit);
// router.delete(
// '/:refUnitId/:serviceId',
// clients.removeServiceFromRefUnit
// );

module.exports = router;
