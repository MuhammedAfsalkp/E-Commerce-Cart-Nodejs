const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

let Db;

const mongoConnect=(callback)=>{
    MongoClient.connect('mongodb://127.0.0.1:27017/',{ useUnifiedTopology: true })
.then(client=>{
    console.log("Database Connected")
    Db=client.db('shop')
    callback()
})
.catch(err=>{
    console.log("Error connecting database",err)
})}

function getDb(){
    if(Db){
        return Db;
    }
    throw "Error connecting Database"
}

exports.mongoConnect=mongoConnect
exports.getDb=getDb

