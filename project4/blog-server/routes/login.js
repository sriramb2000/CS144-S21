const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ENCRYPTION_SECRET = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

const getLoginForm = (req, res, next) => {
    res.render('login', { error: null, redirect: req.query.redirect });
}

// const handleLogin = async(req, res, next) => {
//     const { username, password, redirect } = req.body;
//     // const { redirect } = req.query;

//     try {
//         // if (!req.is('application/x-www-form-urlencoded')) {
//         //     throw new Error("login POST request should have Content-Type=application/x-www-form-urlencoded");
//         // }
//         if (!username || !password) {
//             throw new Error("Please include username and password");
//         }

//         const user = await User.find(username, password);

//         if (!user) {
//             throw new Error("Invalid username/password");
//         }

//         // Create the JWT token
//         const token = jwt.sign({
//             usr: user.username
//         }, ENCRYPTION_SECRET, { expiresIn: "2h", algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } });

//         // Set response cookie
//         res.cookie('jwt', token);


//         if (redirect) {
//             return res.redirect(302, redirect).json({ message: "Authorization successful!" }).send();
//         }

//         return res.sendStatus(200);
//     } catch (e) {
//         console.log(e);
//         return res.status(401).render('login', { error: "Invalid username and/or password", redirect });
//     }
// }

const handleLogin = async(req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let redirect = req.body.redirect;
    if (!username || !password) {
        res.sendStatus(401);
    } else {
        // verify(username, password, function(verified) {
        //     if (!verified) {
        //         res.status(401).render('login', { redirect: redirect });
        //     } else {
        //         var ENCRYPTION_SECRET = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
        //         let options = { algorithm: 'HS256', expiresIn: "2h", header: { "alg": "HS256", "typ": "JWT" } };
        //         var token = jwt.sign({ "usr": username }, ENCRYPTION_SECRET, options);
        //         if (!redirect) {
        //             res.cookie('jwt', token).sendStatus(200);
        //         } else {
        //             res.cookie('jwt', token).redirect(302, redirect);
        //         }
        //     }
        // })

        const user = await User.find(username, password);

        if (!user) {
            res.status(401).render('login', { redirect: redirect });
        } else {
            let options = { algorithm: 'HS256', expiresIn: "2h", header: { "alg": "HS256", "typ": "JWT" } };
            var token = jwt.sign({ "usr": username }, ENCRYPTION_SECRET, options);
            if (!redirect) {
                res.cookie('jwt', token).sendStatus(200);
            } else {
                res.cookie('jwt', token).redirect(302, redirect);
            }
        }
    }
}

const checkAuthentication = (reroute = false) => {
    const authFunc = async(req, res, next) => {
        const token = req.cookies.jwt;
        try {
            if (!token) {
                if (reroute) {
                    res.redirect(302, `/login?redirect=${req.originalUrl}`);
                } else {
                    res.status(401).json('You need to Login');
                }
            } else {
                const decrypt = await jwt.verify(token, ENCRYPTION_SECRET);

                const queryUsername = req.query.username;
                const bodyUsername = req.body.username;

                if ((queryUsername && queryUsername != decrypt.usr) || (bodyUsername && bodyUsername != decrypt.usr)) {
                    res.status(401).json('You need to Login');
                } else {
                    next();
                }
            }
        } catch (err) {
            return res.status(401).send();
        }
    }

    return authFunc;
}

const router = express.Router();
router.get("/", getLoginForm);
router.post("/", handleLogin);

module.exports = {
    router,
    checkAuthentication
};