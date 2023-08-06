const userController = require('../controllers/users')
const projectController = require('../controllers/project')

const router = require('express').Router()

router.post('/signin',userController.signIn)
router.post('/addProject', projectController.createProject)

module.exports=router
