const User = require('../models/authModel')
const Token = require('../models/tokenModel')
const sendEmail = require('../utlis/setEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')



// register user and send email confirmation link

exports.userRegister = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    const url=process.env.FRONTEND_URL+'\/email\/confirmation\/'+token.token
    // sendEmail
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'Email Verificatioin Link',
        html:`<div className="bg-success">
        <p>Hello,please confirm your Email</p>
        <a href="${url}"><button style='background-color:#FF0000 ; padding:5px; border:none; font-size:20px'>Verify</button></a>
            </div>`
        // http:localhost:5000/api/confirmation/8942efc256a1

    })
    res.send(user)
}


// post email confirmation
exports.postEmailConfirmation = (req, res) => {
    // at first find the valid or matching token
    Token.findOne({ token: req.params.token }, (error, token) => {
        if (error || !token) {
            return res.status(400).json({ error: 'Invalid token or token may have expired' })
        }

        // if token is found then find the valid user for that token 

        User.findOne({ _id: token.userId }, (error, user) => {
            if (!user || error) {
                return res.status(400).json({ error: 'we are unable to find valid user for this token' })
            }
            // check if user is already varified 
            if (user.isVeified) {
                return res.status(400).json({ error: 'email has already been verified ,login to continue' })
            }
            // save the verified user
            user.isVeified = true
            user.save((error) => {
                if (error) {
                    return res.status(400).json({ error: error })
                }
                res.json({ message: 'congrats, your email has been verified successfully' })
            })
        })
    })
}

// sign in 
exports.signIn = async (req, res) => {
    const { email, password } = req.body
    // at first find the email registered or not 
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: 'sorry the email you provided not found' })
    }
    // if email is found then checked the password 
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: 'email and password doesnot match' })
    }
    //check if user is verified or not 
    if (!user.isVeified) {
        return res.status(400).json({ error: 'please verify your email at first' })
    }
    // now generate token using user_id and jwt_secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    // now store the token in cookie
    res.cookie('myCookie', token, { expire: Date.now() + 999999 })
    // to send user information in frontend
    const { _id, role, name } = user
    // const name=user.name
    return res.json({ token, user: { name, email, _id, role } })
}
// for signout
exports.signOut = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: 'signout success' })
}

//  forget password 
exports.forgetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: 'sorry the email you have provied not found in our system.' })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    const url=process.env.FRONTEND_URL+'\/reset\/password\/'+token.token
    // sendEmail
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'reset password Link',
        html:`<div className="bg-success">
        <p>Click given butten to reset your password.</p>
        <a href="${url}"><button style='background-color:#FF0000 ; padding:5px; border:none; font-size:20px'>Reset your password</button></a>
            </div>`
    })
    res.json({ message: 'password reset link has been sent to your email.' })
}

//  reset password
exports.resetPassword = async (req, res) => {

    // at first find the valid or matching token
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: 'invalid token or token may have expired.' })
    }


    // if token found then the valid user 
    let user = await User.findOne({
        email: req.body.email,
        _id: token.userId
    })
    if (!user) {
        return res.status(400).json({ error: 'we are unable to find valid user for this token' })
    }
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: 'filed to reset password' })
    }
    res.json({ message: 'password reset successfully' })
}


//  to show userlist
exports.userList = async (req, res) => {
    const user = await User.find().select('-hashed_password').sort({createdAt:-1})
    if (!user) {
        return res.status(400).json({ error: 'something went wrong.' })
    }
    res.send(user)
}



// to show single user
exports.userDetails = async (req, res) => {
    const user = await User.findById(req.params.id).select('-hashed_password')
    if (!user) {
        return res.status(400).json({ error: 'someething went wrong.' })
    }
    res.send(user)
}

//  resend email for verification 
exports.resendVerificatioinMail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    //  at first find the register user
    if (!user) {
        return res.status(400).json({ errora: 'sorry the email you provided not found in our system.' })
    }

    // if user is alredy verified 
    if (user.isVeified) {
        return res.status(400).json({ error: "email has already verified, login to continue." })
    }
    // create token to store in detabase and send to email as params

    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: 'something went wrong.' })
    }

    // resend eamil 
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'Email Verificatioin Link',
        text: `Hello,\n\n please confirm your email by copying the below link:\n\n
        http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`
        // https:localhost:5000/api/confirmation/8942efc256a1
    })
    res.json({ message: 'Email verification link has been sent to your email.' })

}
//  change pasword
exports.changePassword = async (req, res) => {
    const { old_password, new_password } = req.body
    if (!(old_password || new_password))
        return res.status(400).json({ error: 'password doesn`t match' })
        let user =await User.findById(req.params.id)
            if(!user){
                return res.status(500).json({error:'something went wrong.'})
        }
        if(!user.authenticate(old_password))
        {
            return res.status(400).json({error:'password does not match.'})
        }
        user.password=new_password
        user= await user.save()
        res.json({msg:'password change successfully'})
}

// delete user
exports.deleteUser=(req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(!user){
            return res.status(400).json({error:'user not found'})
        }
        else{
            return res.status(200).json({message:'user deleted'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}


// authorization
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

