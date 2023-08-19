const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client')
const path = require("path");
const prisma = new PrismaClient()

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(express.static("src/public"))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const connectDatabase = async () => {
    await prisma.$connect()
    console.log("Connected to database")
}


app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, async () => {
    await connectDatabase()
    console.log('Server is running on port 3000')
})

