const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const app = express()
const User = require('../models/user')

app.get('/usuario', function(req, res) {

    let from = req.query.from || 0
    from = Number(from)

    let limit = req.query.limit || 5
    limit = Number(limit)

    let filter = {
        status: true
    }

    // let response = {
    //     name: "Juanito Perez",
    //     area: "Operaciones",
    //     position: "Diseño",
    //     picture_url: "url"
    // }
    User.find(filter, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count(filter, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    count
                })

            })
        })

})

app.post('/usuario', function(req, res) {

    let body = req.body

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: userDB
        })

    })


})

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status'])

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })

    })

})

app.delete('/usuario/:id', function(req, res) {

    let userId = req.params.id

    User.findByIdAndUpdate(userId, { status: false }, { new: true }, (err, userUpdated) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (userUpdated === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            })
        }

        res.json({
            ok: true,
            user: userUpdated
        })

    })

    // User.findByIdAndRemove(userId, (err, userDeleted) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if (userDeleted === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: "Usuario no existe"
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDeleted
    //     })

    // })

})

module.exports = app;