const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const slugify = require('slugify')

router.get('/admin/article/new', async (req, res) => {
    const categories = await prisma.category.findMany();

    res.render('admin/articles/new', { categories: categories });
})

router.post('/article', async (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let categoryId = req.body.category;

    if (!title || !content || !categoryId) {
        res.redirect('/admin/article/new')
    }

    await prisma.article.create({
        data: {
            title: title,
            content: content,
            slug: slugify(title),
            category: {
                connect: {
                    id: categoryId
                }
            }
        }
    })

    res.redirect('/articles')
})

router.get('/articles', async (req, res) => {
    const articles = await prisma.article.findMany({
        include: {
            category: true
        }
    })

    res.render('admin/articles/list', { articles: articles })
})

module.exports = router