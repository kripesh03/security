const router = require('express').Router()
const tasksController = require('../controllers/task')
const requireRoles = require('../middleware/requireRoles')
const ROLES_LIST = require('../config/rolesList')

router.route('/').get(requireRoles([...Object.values(ROLES_LIST)]), tasksController.getAll)

router.use(requireRoles([ROLES_LIST.Root, ROLES_LIST.Admin]))

router.route('/').post(tasksController.create)

router.route('/:id')
.get(tasksController.getById)
.patch(tasksController.update)
.delete(tasksController.delete)

router.route('/assign').post(tasksController.assignUser)

router.route('/assign/:id')
.get(tasksController.getAssignUser)
.delete(tasksController.deleteAssign)

router.route('/unassigned/:id')
.get(tasksController.getNotAssignUser)

router.route('/inspect').post(tasksController.inspect)

module.exports = router