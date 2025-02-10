const { Router } = require('express');
const clientsController = require('../controllers/clients.controller');

const router = Router();

router.get('/', (req, res) => {
  res.render('pages/instructivos/index.hbs');
});

router.get('/datalogger', (req, res) => {
  res.render('pages/instructivos/datalogger.hbs');
});

module.exports = router;
