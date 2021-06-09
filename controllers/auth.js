const User=require('../models/user')
const bcrypt=require('bcryptjs')
const nodeMailer=require('nodemailer')
const sendGridTransport=require('nodemailer-sendgrid-transport')

const transporter=nodeMailer.createTransport(sendGridTransport({
    

    auth:{
       
        
        api_key:'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'
        
    }

}))

exports.getLogin = (req, res, next) =>{
    // cause error after this it become null after it used inconsole.log(req.flash('error'))
    let message=req.flash('error')
    
    if(message.length >0){
        message=message[0]
    }else{
        message=null
    }
  
    console.log("MID GET LOGIN");
    console.log(req.session)
    console.log(req.session.isLoggedIn)
    res.render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          isAuthenticated:req.session.isLoggedIn,
          errorMessage:message
          
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
        console.log("Email Does not exists !!")
        req.flash('error' , 'Email is not registerd !!!')
        return req.session.save(err=>{
            res.redirect("/login")

        })
        
    }
    else{
        console.log(user.password)
        const match= await bcrypt.compare(password,user.password)
        if(!match){
            req.flash('error','Invalid Password!!')
            return req.session.save(err=>{
                console.log("In correct password")
             res.redirect("/login")

            })
            
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

      
}

exports.postLogout = (req, res, next) => {
    console.log("MID POST LOGOUT");
    req.session.destroy(()=>{
        console.log("session deleted")
        res.redirect("/")

    })    
}


exports.getSignup = (req,res,next)=>{
    let message=req.flash('error')
    if(message.length >0){
        message=message[0]
    }else{
        message=null
    }

    res.render('auth/signup',{path:'/signup',errorMessage:message,
    pageTitle:'signup',isAuthenticated:false
})


}


    
exports.postSignup =async (req,res,next)=>{
    console.log("post signup mid",req.body)
    const email=req.body.email
    const password=req.body.password
    try{
        User.findOne({email:email},async (err,user)=>{
            if(user){
                req.flash('error','Email exists already!!,Enter different Email.')
                return req.session.save(err=>{
                    console.log("existing email")
                 res.redirect("/signup")
                })
                
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
                return transporter.sendMail({
                    to:email,
                    from:'af-shopingcart@afsolutions.xyz',
                    subject:'node project signup',
                    html:'<h1>Successfully signed up.</h1>'
                }).then(ris=>console.log("Email has been sent.")).catch(err=>console.log(err,"sending email"))
                

            }).catch(err=>console.log(err,"signing user"))
            

        })

    }catch(err){
        console.log(err,"post signup")
    }
 
}