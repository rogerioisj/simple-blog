const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client')
const path = require("path");
const prisma = new PrismaClient()
const categoryRouter = require('./category/category.controller')
const articleRouter = require('./article/article.controller')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, "../node_modules/bootstrap/dist/")))
app.use(express.static(path.join(__dirname, "../node_modules/tinymce/")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', categoryRouter)
app.use('/', articleRouter)

const connectDatabase = async () => {
    await prisma.$connect()
    console.log("Connected to database")
}


app.get('/index', async (req, res) => {
    const page = (req.query.page && req.query.page > 0) ? req.query.page : 1;
    const limit = 6;
    const count = await prisma.article.count();
    const articles = await prisma.article.findMany({
        skip: (+page - 1) * limit,
        take: limit,
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    const next = count - page * limit

    res.render('index', { articles: articles, page: page, next: next })
})

app.get('/', async (req, res) => {
    res.redirect('/index')
})

app.listen(3000, async () => {
    await connectDatabase()
    console.log('Server is running on port 3000')
})

