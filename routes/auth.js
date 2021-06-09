const express=require('express')
const authController=require('../controllers/auth')

const router=express.Router()
router.get('/login',authController.getLogin)
router.post('/login',authController.postLogin)
router.post('/logout',authController.postLogout)
router.get('/signup',authController.getSignup)
router.post('/signup',authController.postSignup)
router.get('/reset',authController.getResetPassword)
router.post('/reset',authController.postResetPassword)
router.get('/reset/:token',authController.getNewPassword)
router.post('/new-password',authController.postNewPassword)
module.exports=router;