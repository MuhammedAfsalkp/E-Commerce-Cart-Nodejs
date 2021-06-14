const express = require("express");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth")
const errRoutes = require("./routes/error")
const errorController=require('./controllers/error')
const { controlFav } = require("./Utils/utils");
const path = require("path");
const User=require("./models/user")
const mongoose=require('mongoose')
const session=require('express-session')
const Mongostore=require('connect-mongodb-session')(session)
const csrf=require('csurf')
const flash=require('connect-flash')
const multer=require('multer')


const app = express();
const URI= 'mongodb://127.0.0.1:27017/shop'
const csrfProtection=csrf()
const store= new Mongostore({
    uri:URI,
    collection:"session",
    
})
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{  cb(null,'images')},
    filename:(req,file,cb)=>{ cb(null,Date.now()+'_'+file.originalname)}

})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"   ){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

app.set("view engine", "ejs");
app.set("views", "views");


app.use(bodyparser.urlencoded({ extended: true }));
app.use(multer({storage:fileStorage ,fileFilter:fileFilter}).single('image'))
app.use("/favicon.ico", controlFav);
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false,
    store:store,
    
    
}))
app.use(csrfProtection)
app.use(flash())
// to include variable for evey rendering page throgh res ,locals
app.use((req,res,next)=>{
    // res.locals.isAuthencticated=req.session.isLoggedIn
    res.locals.csrfToken=req.csrfToken()
    next()
})
app.use((req,res,next)=>{
   
    console.log("all ",req.session.isLoggedIn)
    if(!req.session.user){
        return next()
    }
    User.findById(req.session.user._id).then(user=>{
         
        if(!user){
            return next()
        }
        console.log("user mid")
        req.user=user;
        next()
    }).catch(err=>{
        console.log("Error on getting user on req")
        const error=new Error(err)
        error.httpStatusCode=500
        return next(error)
        //return next(new Error(err))
    })


})

//works on routes localhost.../admin/,,existing,,
app.use("/admin", adminRoutes);

//workon localhost../,,existing..
app.use(authRoutes)
app.use(userRoutes);
app.use(errRoutes);



//  app.use('/500',errorController.get500)
app.use(errorController.get404);

app.use((error,req,res,next)=>{
    console.log("Error is",error)
    res.render("500", { pageTitle: "500", path: "/500",
      errorMessage:error, 
      isAuthenticated:req.session.isLoggedIn})
})

mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true , useUnifiedTopology: true })
.then(ris=>{
    console.log("connected Db")
    app.listen(3000, () => console.log("Server connected Successfully"));
}).catch(err=>{
    console.log(err)
    console.log("Erro connecting mongoose")

})


