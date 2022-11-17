const { Router } = require('express');
const refUnitsController = require('../../controllers/refUnits.controller');

const router = Router();

router.get('/', refUnitsController.getRefUnits);
router.get('/:id', refUnitsController.getRefUnitsById);
router.post('/', refUnitsController.saveRefUnit);
router.put('/:id', refUnitsController.updateRefUnit);
router.delete('/:id', refUnitsController.deleteRefUnit);

router.post('/:refUnitId/:serviceId', refUnitsController.addServiceToRefUnit);
router.delete(
  '/:refUnitId/:serviceId',
  refUnitsController.removeServiceFromRefUnit
);

module.exports = router;
