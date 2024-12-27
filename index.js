const express = require("express")
const dbConnect = require("./config/dbConnect")
const {notFound, errorHandler} = require("./middleware/errorHandler")
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8000;
const authRouter = require("./routes/authRoute")
const bodyParser = require("body-parser")

dbConnect()

// app.use('/',(req,res) => {
//     res.send("hello from the server")
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/api/user", authRouter)

// app.use(notFound)
// app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})