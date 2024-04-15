const express=require("express");
const authenticate = require("../middleware/authenticat.js");

const router=express.Router();
const userController=require("../controllers/user.controller.js")

router.get("/",userController.getAllUsers)
router.get("/profile",userController.getUserProfile)
router.put("/:id",authenticate,userController. updateUserPersonalInfo)


module.exports=router;