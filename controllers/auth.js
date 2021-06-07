const User=require('../models/user')
const bcrypt=require('bcryptjs')
exports.getLogin = (req, res, next) =>{
  
    console.log("MID GET LOGIN");
    console.log(req.session)
    console.log(req.session.isLoggedIn)
    res.render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          isAuthenticated:req.session.isLoggedIn
          
        });
      
}

exports.postLogin =async  (req, res, next) => {
    console.log("MID POST LOGIN",req.body);
    const email=req.body.email;
    const password=req.body.password
    try{
    const user=await User.findOne({email:email})
    console.log(user)
    if(!user){
        console.log("This email is not registerd!!")
        return res.redirect("/login")
    }
    else{
        console.log(user.password)
        const match= await bcrypt.compare(password,user.password)
        if(!match){
            console.log("In correct password")
            return res.redirect("/login")
        }
        req.session.isLoggedIn=true;
        req.session.user=user
        await req.session.save()
        console.log(req.get('cookie'))
        res.redirect("/")


    }
    }catch(err){
        console.log(err,"login")
    }

    // User.findById('60bda6443d3e932d3c10e875').then((user)=>{
    //     req.session.isLoggedIn=true;
    //     req.session.user=user
    //     req.session.save(()=>{
    //         console.log(req.get('Cookie'))

    //         res.redirect("/")
   
    //     })
        

    // }).catch(err=>console.log(err,"fetching user"))
    
      
}

exports.postLogout = (req, res, next) => {
    console.log("MID POST LOGOUT");
    req.session.destroy(()=>{
        console.log("session deleted")
        res.redirect("/")

    })    
}


exports.getSignup = (req,res,next)=>{
    res.render('auth/signup',{path:'/signup',pageTitle:'signup',isAuthenticated:false})


}


    
exports.postSignup =async (req,res,next)=>{
    console.log("post signup mid",req.body)
    const email=req.body.email
    const password=req.body.password
    try{
        User.findOne({email:email},async (err,user)=>{
            if(user){
                console.log("existing email")
                return res.redirect("/signup")
            }
            const hashPaasword= await bcrypt.hash(password,12)
            const us=new User({
                email:email,
                password:hashPaasword,
                cart:{ items :[]}
            })
            us.save().then(ris=>{
                console.log("added user")
                 res.redirect("/login")

            }).catch(err=>console.log(err,"signing user"))
            

        })

    }catch(err){
        console.log(err,"post signup")
    }
    // User.findOne({email:email}).then((user)=>{
    //     if(user){
    //         console.log("email already exists")
    //         return res.redirect("/signup")
    //     }
    //     const us=new User({
    //         email:email,
    //         password:password,
    //         cart:{ items :[]}
    //     })
    //     return us.save()

    // }).then((ris)=>{
    //     console.log("added user")
    //     res.redirect("/login")
    // })
    // .catch(err=>console.log(err,"post signup"))




    
    
}