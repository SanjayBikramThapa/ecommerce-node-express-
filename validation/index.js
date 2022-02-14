exports.productValidation=(req,res,next)=>{

    req.check('product_name','product name is required').notEmpty()

    req.check('product_price','product price is required').notEmpty()
    .isNumeric()
    .withMessage('price only contain numeric value')

    req.check('countInStock','stock number is required').notEmpty()
    .isNumeric()
    .withMessage('stock only contain numeric value')

    req.check('product_description','Description is required').notEmpty()
    .isLength({
        min:20
    })
    .withMessage('description must be minimum of 20 characters')
    
    req.check('category','category is requiered').notEmpty()
    
    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(err=>err.msg)[0]
        return res.status(400).json({error:showError})
    }
    next()
}

// for sign up
exports.signupValidation=(req,res,next)=>{

    req.check('name','name is required').notEmpty()

    req.check('email','email is required').notEmpty()

    req.check('password','password is required').notEmpty()

    const errors=req.validationErrors()
    if(errors){
        const showError=errors.map(err=>err.msg)[0]
        return res.status(400).json({error:showError})
    }
    next()
}