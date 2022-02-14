const express = require('express')
const { requireSignin } =require('../controllers/authController')
const { demoFunction, postCategory, categoryList, categoryDetails, updateCategroy, deleteCategory } = require('../controllers/categoryController')
const router = express.Router()

router.get('/welcome',demoFunction)
router.post('/postcategory',requireSignin,postCategory)
router.get('/categorylist',categoryList)
router.get('/categorydetails/:id',categoryDetails)
router.put('/updatecategory/:id',requireSignin,updateCategroy)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)

module.exports=router
// for default method export