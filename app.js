require('dotenv').config()
require('./db/conn')
const express = require("express")
const cors = require('cors');
const bodyParser = require('body-parser')
const userRouter = require('./Routes/router')
// const morgan = require("morgan")

const app = express();


const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/user', userRouter)
app.use('/uploads', express.static("./uploads"))
app.use('/files', express.static('./public/files'))
app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
})



app.listen(PORT, () => {
    console.log("server is running on port", PORT)
})