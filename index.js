const {connection}=require('./Config/db');
require('dotenv').config();
const app=require('express')();
const {postProduct}=require('./Routes/postProduct.route')
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// *ROUTES*

app.use('/',postProduct)

app.listen(9160,async()=>{
    try{
        await connection;
        console.log("Connected to DB🎉🎉")
    }catch(err){
        console.log("error",err)
    }

    console.log("Server is running..🚀")
})