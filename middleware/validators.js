const {check}=require('express-validator')
const { Error } = require('mongoose')
const User=require('../models/user')
const bcrypt=require('bcryptjs')

exports.validateSignUp=[
    check('email')
    .exists()
    .withMessage("Email is not existing")
     .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Email address!")
    .bail()
    .custom( async (value)=>{
        console.log(value)
        let user=await User.findOne({email:value})
            if(user){
                return Promise.reject("Email already in use")
            }
        
    })
    .bail(),
    
    check('password')
    .exists()
    .withMessage("Password is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Password!")
    .bail()
    .isLength({min:5})
    .withMessage("Password should contain minimum 5 characters!")
    .bail(),
    
    check('confirmPassword')
    .exists()
    .withMessage("Confirm Password")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Confirm Password...")
    .custom((value,{req})=>{
        if(value != req.body.password){
            throw new Error("Pssword Confirmation does not match password")
        }
        return true
    })


]


exports.validateLogin=[

    check('email')
    .exists()
    .withMessage("Email is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Email address!")
    .bail()
    .custom(  (value)=>{
        console.log(value)
        return User.findOne({email:value}).then(user=>{
            if(!user){
                return Promise.reject("Email is not registered")
            }
        })
    })
    .bail(),

    check('password')
    .exists()
    .withMessage("Password is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Password!")
    .bail()
    .trim()
    .custom(async (value,{req})=>{
        const user= await User.findOne({email:req.body.email})
        const match=await bcrypt.compare(value,user.password)
        if(!match){
            return Promise.reject("Invalid Password")
        }

    })

]



exports.validateReset=[
    check('email')
    .exists()
    .withMessage("Email is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Email address!")
    .bail()
    .custom(async (value)=>{
        let user=await User.findOne({email:value})
        if(!user){
            return Promise.reject("Email is not registered")
        }

    })

]

exports.validateNewPassword=[
    check('password')
    .exists()
    .withMessage("Password is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter password!")
    .bail()
    .isLength({min:5})
    .withMessage("Password should contain minimum 5 characters!")
    .bail()

]


exports.validateAddProduct=[
    check('product')
    .exists()
    .withMessage("Title is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Title")
    .bail()
    .isString()
    .withMessage("Title should not contain special characters")
    .bail()
    .isLength({min:5})
    .withMessage("Title should contain minimum 5 characters!")
    .bail(),
    
    // check('imageurl')
    // .isURL()
    // .withMessage("Imageurl should be valid"),

    check('price')
    .exists()
    .withMessage("Price is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Price")
    .bail()
    .isNumeric()
    .withMessage("Price should be a numer")
    .bail(),

    check('description')
    .exists()
    .withMessage("Description is not existing")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Enter Description")
    .bail()
    .isLength({min:5})
    .withMessage("Description should contain minimum 5 characters!")
    .trim()
    

]