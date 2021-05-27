const express = require("express");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorController=require('./controllers/error')
const { controlFav } = require("./Utils/utils");
const mongoConnect=require("./Utils/database").mongoConnect
const path = require("path");
const User=require("./models/user")

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/favicon.ico", controlFav);
app.use(express.static(path.join(__dirname, "public")));
app.use((req,res,next)=>{
    User.findbyid("60af703911a3afa395b72f8d").then(user=>{
        req.user=user
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
mongoConnect(()=>{
    app.listen(3000, () => console.log("Server connected Successfully"));

})


