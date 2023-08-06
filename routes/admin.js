const userController = require('../controllers/users')
const router = require('express').Router()

router.post('/signup', userController.signUp)
router.post('/signin',userController.signIn)

module.exports=router
