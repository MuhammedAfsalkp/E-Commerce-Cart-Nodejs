exports.error=(req, res, next) => {
  let message=req.flash('error')
    if(message.length > 0){
        message=message[0]
    }else{
        message=null;
    }
    console.log("ERROR page");

    console.log(req.url)
    
    res.render("404", { pageTitle: "Page not found", path: "/error", 
    errorMessage:message,
    isAuthenticated:req.session.isLoggedIn});
  }