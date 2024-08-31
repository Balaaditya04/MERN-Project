const moongoose = require('mongoose')

const express = require('express');
const path = require('path')
const app = express();
// app.use(express.json);
const mongoByMe = require('./mainMongodb')
const contactDataBase = require('./contactMongodb')
const { url } = require('inspector');
const { error } = require('console');
app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname,'public')));


app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login.html'));
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

app.get('/error404',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','error404.html'));
})


app.post('/login', async(req,res)=>{
    
    try{
        console.log(req.body.email);
        console.log(req.body.password);
        const check = await mongoByMe.findOne({email : req.body.email});
        console.log(`DataBase password is ${check.password} and user password is ${req.body.password}`)
        if(check.password == req.body.password){
            res.sendFile(path.join(__dirname,'public','homePage.html'));
            // res.redirect('/homePage')
        }else{

            res.sendFile(path.join(__dirname,'public','error404.html'));
            console.log("error from the else block")
            res.redirect('/error404');

           
        }
    }catch(err){
        // res.sendFile(path.join(__dirname,'public','error404.html'))
        res.redirect('/error404')
        console.log(`error from catch block ${err} `)
    }
    // res.redirect('/homePage')
    // res.sendFile(path.join(__dirname,'public','homePage.html'));
})






app.post('/signup', async(req,res)=>{
   
    try{
        console.log(req.body.name),
        console.log(req.body.username)
        console.log(req.body.password)
        const data = {
            name : req.body.name,
            password : req.body.password,
            username : req.body.username,
            email : req.body.email,
            phoneNumber : req.body.phoneNumber,
            gender : req.body.gender
        }
        console.log(data);
        await mongoByMe.insertMany([data]);
       
        res.redirect('/homePage')
        // res.sendFile(path.join(__dirname,'public','homePage.html'))
    
    }catch{
        res.sendFile(path.join(__dirname,'public','error404.html'))
        console.log("error Not able to add");
    }

})


// app.get('/signup',(req,res)=>{
//     res.sendFile(path.join(__dirname,'public','signup.html'));
// })

app.get('/homePage',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','homePage.html'))
})




app.post('/homePage',async(req,res)=>{
    try{ 
        console.log(`Name in Contact form is ${req.body.name}`)
        console.log("Email is"+req.body.email);
        const ContactData = {
            name : req.body.name,
            email : req.body.email,
            message : req.body.message,
        }
        console.log(ContactData)
        await contactDataBase.insertMany([ContactData])
        // res.sendFile(path.join(__dirname,'public','index.html'));
        res.redirect('/homePage');        

    }catch(err){
        console.log('Error in data IN contactUs '+err)
    }
})


app.listen(3000,()=>{
    console.log("App is listinig at port 3000")
})