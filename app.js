const express = require("express");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorController=require('./controllers/error')
const { controlFav } = require("./Utils/utils");
const path = require("path");
const User=require("./models/user")
const mongoose=require('mongoose')

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/favicon.ico", controlFav);
app.use(express.static(path.join(__dirname, "public")));
app.use((req,res,next)=>{
    User.findById('60b1cbdc4c3ec021a0c7f980').then(user=>{
        console.log("user mid")
        req.user=user;
        next()
    }).catch(err=>{
        console.log("Error on getting user")
    })


})

//works on routes localhost.../admin/,,existing,,
app.use("/admin", adminRoutes);

//workon localhost../,,existing..
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


