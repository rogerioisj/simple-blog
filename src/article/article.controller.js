const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const slugify = require('slugify')

router.get('/admin/article/new', (req, res) => {
    res.render('admin/articles/new');
})

router.post('/article', async (req, res) => {

})

module.exports = router