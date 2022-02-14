const express=require('express')
require('dotenv').config()
const db=require('./database/connection')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute',)
const bodyParser=require('body-parser')
const expressValidator=require('express-validator')
const authRoute=require('./routes/authRoutes')
const orderRoute=require('./routes/orderRoute')
const cookieParser=require('cookie-parser')
const cors =require('cors')

const app=express()

// middileware
app.use(bodyParser.json())
app.use(expressValidator())
app.use('/public/uploads',express.static('public/uploads'))
// express.static is required for css and image file to read
app.use(cookieParser())
app.use(cors())

// app.get('/hello',(req,res)=>{
//     res.send('welcome to js express backend')
// })

// routes 
app.use('/api',categoryRoute)
app.use('/api',productRoute)
app.use('/api',authRoute)
app.use('/api',orderRoute)


const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})
