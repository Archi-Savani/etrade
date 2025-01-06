const express = require("express")
const dbConnect = require("./config/dbConnect")
const {notFound, errorHandler} = require("./middleware/errorHandler")
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8000;
const authRouter = require("./routes/authRoute")
const productRouter = require("./routes/productRoute")
const bodyParser = require("body-parser")
const cokkieParser = require("cookie-parser")
const morgan = require("morgan")

dbConnect()

// app.use('/',(req,res) => {
//     res.send("hello from the server")
// })

app.use(cors({
    origin: 'http://localhost:3000', // Correct frontend URL
    credentials: true, // Allow credentials (cookies, auth tokens, etc.)
}));

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cokkieParser())

app.use("/api/user", authRouter)
app.use("/api/product", productRouter)

app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})