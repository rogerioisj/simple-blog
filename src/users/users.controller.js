const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new')
})

router.post('/user', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    if (!email || email === '' || !password || password === '' || !name || name === '') {
        res.redirect('/admin/users/new')
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(user) {
        res.redirect('/admin/users/new')
        return;
    }

    await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name
        }
    })

    res.redirect('/admin/users')
})

router.get('/admin/users', async (req, res) => {
    const users = await prisma.user.findMany()

    res.render('admin/users/list', { users: users })
})

module.exports = router