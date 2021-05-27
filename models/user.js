const getDb=require("../Utils/database").getDb
const ObjectId=require("mongodb").ObjectId

class User{
    constructor(name,email){
        this.name=name;
        this.email=email;

    }
    save(){
        const Db=getDb()
        const users=Db.collection("users")
        return users.insertOne(this).then(risult=>{
            console.log(risult)
            return risult
        }).catch(err=>{
            console.log(err)
        })

    }
    static findbyid(id){
        const Db=getDb()
        const users=Db.collection("users")
        return users.findOne({_id:new ObjectId(id)}).then(ris=>{
            console.log(ris)
            return ris
        }).catch(err=>{
            console.log(err)
        })

    }
}

module.exports=User