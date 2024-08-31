const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/MainWebsiteProject")
.then(()=>{
    console.log("Contact us dataBase Connected");
})
.catch((err)=>{
    console.log(`Contact Us dataBase NOt connected ${err}`)
})


const ContactSchema = new mongoose.Schema({
    name:{
        type: String,
        require : true
    },
    email :{
        type : String,
        require : true
    },
    message :{
        type : String,
        require : true,
    }

})

const ContactMonogodb = new mongoose.model('ContactUsData',ContactSchema);
module.exports = ContactMonogodb;