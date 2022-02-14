
const express=require('express')

const router=express.Router()
const { userRegister, postEmailConfirmation, signIn, signOut, forgetPassword, resetPassword, userList, userDetails, resendVerificatioinMail, requireSignin, changePassword, deleteUser } = require("../controllers/authController")
const { signupValidation } = require('../validation')


router.post('/register',signupValidation,userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/signout',signOut)
router.post('/forgetpassword',forgetPassword)
router.put('/resetpassword/:token',resetPassword)
router.get('/userlist',requireSignin, userList)
router.get('/userdetails/:id',requireSignin,userDetails)
router.post('/resendverificatiion',resendVerificatioinMail)
router.put('/changepasword/:id',requireSignin,changePassword)
router.delete('/deleteuser/:id',deleteUser)

module.exports=router