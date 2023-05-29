const { Router } = require('express');
const pendingTasksController = require('../controllers/pendingTasks.controller');

const router = Router();

router.get('/', pendingTasksController.getPendingTasks);
router.get('/:id', pendingTasksController.getPendingTaskById);
router.post('/', pendingTasksController.savePendingTask);

module.exports = router;
