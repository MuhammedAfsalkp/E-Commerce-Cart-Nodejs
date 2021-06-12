exports.get404=(req, res, next) => {
  let message=req.flash('error')
    if(message.length > 0){
        message=message[0]
    }else{
        message=null;
    }
    console.log("ERROR 400 page");

    console.log(req.url)
    
    res.render("404", { pageTitle: "Page not found", path: "/error", 
    errorMessage:message,
    isAuthenticated:req.session.isLoggedIn});
  }


  exports.get500=(req, res, next) => {
    let message=req.flash('error')
    if(message.length > 0){
        message=message[0]
    }else{
        message=null;
    }
    
  
      console.log("ERROR  500 page");
  
      console.log(req.url)
      
      res.render("500", { pageTitle: "500", path: "/500", 
       errorMessage:message,
      isAuthenticated:req.session.isLoggedIn});
    }