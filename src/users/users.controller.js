const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const adminAuth = require('../middlewares/auth-admin.middleware')

router.get('/admin/users/new', adminAuth, (req, res) => {
    res.render('admin/users/new')
})

router.post('/user', adminAuth, async (req, res) => {
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

router.get('/admin/users', adminAuth, async (req, res) => {
    const users = await prisma.user.findMany()

    res.render('admin/users/list', { users: users })
})

router.get('/login', async (req, res) => {
    res.render('admin/users/login')
})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || email === '' || !password || password === '') {
        res.redirect('/login')
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!user) {
        res.redirect('/login')
        return;
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        res.redirect('/login')
        return;
    }

    req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name
    }

    res.redirect('/')
})

router.post('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router