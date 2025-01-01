const express= require("express")
const cors = require('cors');
const connected = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const server = express()
require("dotenv").config()
const PORT= process.env.PORT || 8000


server.use(cors())
server.use(express.json())


server.get("/", (req, res)=>{
    res.status(200).send("wellcome to home page.")
})

server.use("/restarunet", bookingRoutes)

server.listen(PORT, async()=>{
    try {
        await connected
        console.log(`server running on ${PORT} also connected Db`);
    } catch (error) {
        console.log("something wrong");
    }
})


