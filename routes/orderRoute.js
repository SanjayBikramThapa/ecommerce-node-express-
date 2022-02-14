const express =require('express')
const { postOrder, orderList, orderDetails, updateOrder, deleteOrder, userOrders } = require('../controllers/orderController')
const router=express.Router()

router.post('/postorder',postOrder)
router.get('/orderlist',orderList)
router.get('/orderdetails/:id',orderDetails)
router.put('/updateorder/:id',updateOrder)
router.delete('/deleteorder/:id',deleteOrder)
router.get('/userorderlist/:Userid',userOrders)

module.exports=router