const express = require('express');
const UserController = require('../controller/userController');
const auth = require('../auth/auth');
const authAdmin = require('../auth/authAdmin');
const router = express.Router() ; 


router.post("/register", UserController.register) ; 
router.post("/login" ,UserController.login ) ; 
router.get("/leaderBoard" , auth , authAdmin,UserController.getLeaderBoard)
router.post("/update" , auth ,UserController.updateUserPuzzleTime)
router.post("/updatetotaltime" , auth ,UserController.updateUserTime)
router.get("/getAverageTime" , auth , authAdmin, UserController.getAverageTime)
router.get('/info',auth,UserController.getUser)


module.exports = router ; 
