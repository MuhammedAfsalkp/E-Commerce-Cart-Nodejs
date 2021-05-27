const path=require('path')
const controlFav=(req,res,next)=>{
    res.sendStatus(204)
}
//give main directory path this project working (here give  CompleteNOde)
dir=path.dirname(require.main.filename)
console.log(dir)



module.exports={controlFav,dir}




  







