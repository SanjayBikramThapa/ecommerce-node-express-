const OrderItem=require('../models/orderItem')
const Order=require('../models/orderModel')

// post order
exports.postOrder=async(req,res)=>{
    const orderItemsIds=Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem=new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem= await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemsIdsResolved=await orderItemsIds

    const totalPrices=await Promise.all(orderItemsIdsResolved.map(async(orderItemsId)=>{
        const orderItem=await OrderItem.findById(orderItemsId).populate('product','product_price')
        const total=orderItem.quantity * orderItem.product.product_price
        return total
    }))
    const TotalPrice=totalPrices.reduce((a,b)=>a+b,0)

    let order=new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:TotalPrice,
        user:req.body.user
    })
    order=await order.save()
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(order)
}


// show orderlist
exports.orderList=async(req,res)=>{
    const order=await Order.find().populate('user','name').sort({dateOrdered:-1})
    if(!order){
        return res.status(400).json({error:'Something went wrong you have no more order.'})
    }
    res.send(order)
}

// show single order
exports.orderDetails=async(req,res)=>{
    const order=await Order.findById(req.params.id).populate('user','name')
        if(!order){
            return res.status(400).json({error:'Something went wrong you have no more order. '})
        }
 res.send(order)
}

// to update category
exports.updateOrder=async(req,res)=>{
    const orderItemsIds=Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem=await OrderItem.findByIdAndUpdate(req.params.id,
            {
                quantity:orderitem.quantity
            },
            {new:true})
        newOrderItem= await newOrderItem.save()
        return newOrderItem._id
    }))
        const order=await Order.findByIdAndUpdate(req.params.id,
            {   
                shippingAddress1:req.body.shippingAddress1,
                shippingAddress2:req.body.shippingAddress2,
                city:req.body.city, 
                zip:req.body.zip,
                country:req.body.country,
                phone:req.body.phone
            },
            {new:true})
            if(!order){
                return res.status(400).json({error:'order can not be updated'})
            }
            res.send(order)
}

// to delete order
exports.deleteOrder=(req,res)=>{
   Order.findByIdAndRemove(req.params.id).then(async(order)=>{
       if(order){
           await order.orderItems.map(async orderItem=>{
               await OrderItem.findByIdAndRemove(orderItem)
           })
       return res.status(200).json({message:'order cancled successfullly.'})
       }
       else{
        return res.status(400).json({error:'Order not found'})
       }
   })
   .catch(err=>{
    return res.status(400).json({error:{err}})
   })
}

// to show single user order
exports.userOrders=async(req,res)=>{
    const userOrderList=await Order.find({user:req.params.Userid})
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
    }).sort({dateOrdered:-1})

    if(!userOrderList){
        return res.status(500).json({error:'something went wrong.'})
    }
    res.send(userOrderList)
}