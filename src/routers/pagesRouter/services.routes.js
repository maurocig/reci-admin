const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("pages/services", { layout: "index" });
});

// router.get('/:id', servicesController.getRefUnitsById);
// router.post('/', servicesController.saveRefUnit);
// router.put('/:id', servicesController.updateRefUnit);
// router.delete('/:id', servicesController.deleteRefUnit);

// router.post('/:refUnitId/:serviceId', servicesController.addServiceToRefUnit);
// router.delete(
// '/:refUnitId/:serviceId',
// servicesController.removeServiceFromRefUnit
// );

module.exports = router;
