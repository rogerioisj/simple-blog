const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const slugify = require('slugify')

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories', async (req, res) => {
    const title = req.body.title

    if (!title || title === '') {
        res.redirect('/admin/categories/new')
    }

    await prisma.category.create({
        data: {
            title: title,
            slug: slugify(title, { lower: true })
        }
    })

    res.redirect('/admin/categories/new')
})

router.get('/categories', async (req, res) => {
    const categories = await prisma.category.findMany()

    res.render('admin/categories/list', { categories: categories })
})

router.post('/categories/:id', async (req, res) => {
    if(!req.params.id || req.params.id === '') {
        res.redirect('/categories')
        return;
    }

    await prisma.category.delete({
        where: {
            id: req.params.id
        }
    })

    res.redirect("/categories")
})

router.get('/categories/:id', async (req, res) => {
    if(!req.params.id || req.params.id === '') {
        res.redirect('/categories')
        return;
    }

    const category = await prisma.category.findUnique({
        where: {
            id: req.params.id
        }
    })

    res.render('admin/categories/edit', { category: category })
})

router.post('/categories/:id/edit', async (req, res) => {
    if(!req.params.id || req.params.id === '') {
        res.redirect('/categories')
        return;
    }

    await prisma.category.update({
        where: {
            id: req.params.id
        },
        data: {
            title: req.body.title,
            slug: slugify(req.body.title, { lower: true })
        }
    })

    res.redirect('/categories')
})

module.exports = router