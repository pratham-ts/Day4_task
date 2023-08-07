const userController = require('../controllers/users')
const auth = require('../middleware/auth')
const projectController = require('../controllers/project')
const router = require('express').Router()

router.post('/signup', userController.signUp)
router.post('/signin',userController.signIn)
router.post('/updateProject/:id',auth, projectController.updateProject)
router.delete('/deleteProject/:id',auth,projectController.deleteProject)

module.exports=router
