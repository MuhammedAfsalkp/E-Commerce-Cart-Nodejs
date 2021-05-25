const express = require("express");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorController=require('./controllers/error')
const { controlFav } = require("./utils");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/favicon.ico", controlFav);
app.use(express.static(path.join(__dirname, "public")));

//works on routes localhost.../admin/,,existing,,
app.use("/admin", adminRoutes);

//workon localhost../,,existing..
app.use(userRoutes);

app.use(errorController.error);

app.listen(3000, () => console.log("Server connected Successfully"));
