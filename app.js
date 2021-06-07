const express = require("express");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth")
const errorController=require('./controllers/error')
const { controlFav } = require("./Utils/utils");
const path = require("path");
const User=require("./models/user")
const mongoose=require('mongoose')
const session=require('express-session')
const Mongostore=require('connect-mongodb-session')(session)
const csrf=require('csurf')

const app = express();
const URI= 'mongodb://127.0.0.1:27017/shop'
const csrfProtection=csrf()
const store= new Mongostore({
    uri:URI,
    collection:"session"
})

app.set("view engine", "ejs");
app.set("views", "views");


app.use(bodyparser.urlencoded({ extended: true }));
app.use("/favicon.ico", controlFav);
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false,
    store:store
}))
app.use(csrfProtection)
app.use((req,res,next)=>{
    if(!req.session.user){
        return next()
    }
    User.findById(req.session.user._id).then(user=>{
        console.log("user mid")
        req.user=user;
        next()
    }).catch(err=>{
        console.log("Error on getting user on req")
    })


})
// to include variable for evey rendering page throgh res ,locals
app.use((req,res,next)=>{
    // res.locals.isAuthencticated=req.session.isLoggedIn
    res.locals.csrfToken=req.csrfToken()
    next()
})

//works on routes localhost.../admin/,,existing,,
app.use("/admin", adminRoutes);

//workon localhost../,,existing..
app.use(authRoutes)
app.use(userRoutes);


app.use(errorController.error);
mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true , useUnifiedTopology: true }).then(ris=>{
    console.log("connected Db")
    User.findOne().then(user=>{
        if(!user){    
        const user=new User({name:'afsal',email:'mohamedafsalkp321@gmail.com',cart:{items:[]}})
        user.save().then(()=>console.log("user created"))
        }

    })
   
    app.listen(3000, () => console.log("Server connected Successfully"));
}).catch(err=>{
    console.log(err)
    console.log("Erro connecting mongoose")
})


