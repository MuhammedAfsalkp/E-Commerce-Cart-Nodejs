exports.getLogin = (req, res, next) =>{
  
    console.log("MID GET LOGIN");
    console.log(req.session.isLoggedIn)
    res.render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          
        });
      
}

exports.postLogin = (req, res, next) => {
    console.log("MID POST LOGIN");
    // res.setHeader('Set-Cookie','loggedIn=true')
    req.session.isLoggedIn=true;
    console.log(req.get('Cookie'))
    res.redirect("/")
      
}