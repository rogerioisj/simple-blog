const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const slugify = require('slugify')
const adminAuth = require('../middlewares/auth-admin.middleware')

router.get('/admin/article/new', adminAuth, async (req, res) => {
    const categories = await prisma.category.findMany();

    res.render('admin/articles/new', { categories: categories });
})

router.post('/article', adminAuth, async (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let categoryId = req.body.category;

    if (!title || !content || !categoryId) {
        res.redirect('/admin/article/new')
        return;
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
    return;
})

router.get('/articles', adminAuth, async (req, res) => {
    const page = (req.query.page && req.query.page > 0) ? req.query.page : 1;
    const limit = 10;
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

    res.render('admin/articles/list', { articles: articles })
    return;
})

router.get('/article/:slug', async (req, res) => {
    if(!req.params.slug) {
        res.redirect('/articles')
        return;
    }

    const article = await prisma.article.findUnique({
        where: {
            slug: req.params.slug
        }
    })

    res.render('admin/articles/show', { article: article })
})

router.get('/article/:id/edit', adminAuth, async (req, res) => {
    if(!req.params.id) {
        res.redirect('/articles')
        return;
    }

    const article = await prisma.article.findUnique({
        where: {
            id: req.params.id
        },
        include: {
            category: true
        }
    })

    const categories = await prisma.category.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    res.render('admin/articles/edit', { article: article, categories: categories })
})

router.post('/article/:id/edit', adminAuth, async (req, res) => {
    if(!req.params.id) {
        res.redirect('/articles')
        return;
    }

    await prisma.article.update({
        where: {
            id: req.params.id
        },
        data: {
            title: req.body.title,
            content: req.body.content,
            slug: slugify(req.body.title),
            category: {
                connect: {
                    id: req.body.category
                }
            }
        }
    })

    res.redirect('/articles')
})

router.post('/article/:id/delete', adminAuth, async (req, res) => {
    if(!req.params.id) {
        res.redirect('/articles')
        return;
    }

    await prisma.article.delete({
        where: {
            id: req.params.id
        }
    })

    res.redirect('/articles')
})

module.exports = router