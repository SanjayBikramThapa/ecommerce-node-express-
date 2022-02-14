const Product=require('../models/productModel')

// to insert product

exports.postProduct=async(req,res)=>{
    let product=new Product({
        product_name:req.body.product_name,
        product_price:req.body.product_price,
        countInStock:req.body.countInStock,
        product_description:req.body.product_description,
        product_image:req.file.path,
        category:req.body.category
    })
    product= await product.save()

    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}

// to show all product 
exports.productList=async(req,res)=>{
    let order=req.query.order ? req.query.order : 'asc'
    let sortBy= req.query.order ? req.query.sortBy: '_id'
    let limit=req.query.order ? parseInt(req.query.limit): 200

    const product=await Product.find()
    .populate('category') 
    .sort([[sortBy,order]])
    .limit(limit)
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(product)
}

// to show single product 
exports.productDetails=async(req,res)=>{
     const product=await Product.findById(req.params.id)
     if(!product){
        return res.status(400).json({error:'something went wrong'})
     }
     res.send(product)
}

// to update product
exports.updateProduct=async(req,res)=>{
    const product=await Product.findByIdAndUpdate(
        req.params.id,
        {
            product_name:req.body.product_name,
            product_price:req.body.product_price,
            countInStock:req.body.countInStock,
            product_description:req.body.product_description,
            product_image:req.body.product_image,
            category:req.body.category
        },
        {new:true}
    )
        if(!product){
            return res.status(400).json({error:'something went wrong'})
        }
        res.send(product)
}

// to delete product
exports.deleteProduct=(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(!product){
            return res.status(400).json({error:'product not found'})
        }
        else{
            return res.status(200).json({message:'product deleted successfully'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}
// to show related product
exports.relatedProductList=async(req,res)=>{
    let Single_product=await Product.findById(req.params.id);
    let limit=req.query.limit ? parseInt(req.params.limit):6
    let product=await Product.find({_id:{$ne:Single_product},category:Single_product.category}).limit(limit)
    .populate('category','category_name')
    if(!product){
        return res.status(500).json({error:"something went wrong."})
    }
    res.send(product)

}