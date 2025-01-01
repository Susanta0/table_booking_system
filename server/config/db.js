const {connect}=require("mongoose")
require('dotenv').config();

const url= process.env.MONGO_URL

const connected= connect(url)

module.exports=connected