const userController = require("../controllers/users");
const router = require("express").Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/updateMobileNumber", userController.updateMobileNumber);
router.post("/verifyMobileNumber", userController.verifyMobileNumber);
module.exports = router;
