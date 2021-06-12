const express=require('express')
const errorController=require('../controllers/error')


const router=express.Router();


router.get("/404",errorController.get404)
router.get("/500",errorController.get500)



module.exports = router