const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ENCRYPTION_SECRET = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

const getLoginForm = (req, res, next) => {
    res.render('login', { error: null, redirect: req.body.redirect });
}

const handleLogin = async(req, res, next) => {
    const { username, password, redirect } = req.body;
    // const { redirect } = req.query;

    try {
        // if (!req.is('application/x-www-form-urlencoded')) {
        //     throw new Error("login POST request should have Content-Type=application/x-www-form-urlencoded");
        // }
        if (!username || !password) {
            throw new Error("Please include username and password");
        }

        const user = await User.find(username, password);

        if (!user) {
            throw new Error("Invalid username/password");
        }

        // Create the JWT token
        const token = jwt.sign({
            usr: user.username
        }, ENCRYPTION_SECRET, { expiresIn: "2h", algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } });

        // Set response cookie
        res.cookie('jwt', token);


        if (redirect) {
            return res.redirect(302, redirect).json({ message: "Authorization successful!" }).send();
        }

        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.status(401).render('login', { error: "Invalid username and/or password", redirect });
    }
}

const checkAuthentication = async(req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (!token) {
            return res.status(401).json('You need to Login');
        }

        const decrypt = await jwt.verify(token, ENCRYPTION_SECRET);

        const queryUsername = req.query.username;
        const bodyUsername = req.body.username;

        if ((queryUsername && queryUsername != decrypt.usr) || (bodyUsername && bodyUsername != decrypt.usr)) {
            return res.status(401).json('You need to Login');
        }
        return next();
    } catch (err) {
        return res.status(401).send();
    }
}

const router = express.Router();
router.get("/", getLoginForm);
router.post("/", handleLogin);

module.exports = {
    router,
    checkAuthentication
};