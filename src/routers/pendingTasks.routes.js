const { Router } = require('express');
const pendingTasksController = require('../controllers/pendingTasks.controller');

const router = Router();

router.get('/', pendingTasksController.getPendingTasks);
// router.get('/:id', pendingTasksController.getPendingTaskById);
router.get('/editar/:id', pendingTasksController.editTaskForm);
router.post('/', pendingTasksController.savePendingTask);
router.put('/:id', pendingTasksController.updatePendingTask);

module.exports = router;
