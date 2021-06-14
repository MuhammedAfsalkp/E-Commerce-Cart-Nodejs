const fs=require('fs')

exports.deleteFile=async (path)=>{
    return new Promise((resolve,reject)=>{
        fs.unlink(path,(err)=>{
            
            if(err){
                const error=new Error('Path not found for deleting')
               reject(error)
                
            }
            console.log("Deleted image file")
            resolve('success')
        })

    })
 
}

