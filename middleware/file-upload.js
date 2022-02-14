const multer=require('multer')
// to read folder
const fs=require('fs')
// to read name 
const path=require('path')


const storages=multer.diskStorage({

    destination:(req,file,cb)=>{
        let fileDestination='public/uploads/'
        // to check if directory exists
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true})
            // recursive:true means it creates parent folder as well as sub folder
            cb(null,fileDestination)
        }
        else{
            cb(null,fileDestination)
        }
    },
    filename:(req,file,cb)=>{
        let filename=path.basename(file.originalname,path.extname(file.originalname))

        // path.basename(abc.jpg,jpg)
        // return abc
        let ext=path.extname(file.originalname)
        cb(null,filename+'_'+ Date.now()+ext)
    }
})

let imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|JPG|JPEG|PNG|SVG|JFIF)$/)){
        return cb(new Error('you can upload image file only'),false)
    }
    else{
        cb(null,true)
    }
}

let upload=multer({
    storage:storages,
    fileFilter:imageFilter,
    limit:{
        fileSize:5000000 // 5MB
    }
})

module.exports=upload