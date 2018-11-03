const express = require('express');
const router = express.Router();
const winston = require('winston');
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
let User = require('../models/userModel');
const config = require('../config/settings');
let crypto = require('crypto');
let transporter = require('../config/mailer');

const tokenVerify = require('../auth/verifytoken');


router.post('/', (req, res, next) => {
    //console.log(req.body);
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            res.status(500).send({ success: false, 'error': err, 'message': 'problem encounterd' });
            return;
        }
        res.send({ success: true, 'message': 'Data saved successfully' });
    });
});

router.post('/authenticate', (req, res, next) => {
    console.log(req.body.email);
    User.findOne({ 'email': req.body.email }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.', error: 'Authentication failed. User not found.' });
        } else if (user) {

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.send({ 'error': 'login details are not valid' });
            }

            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800 // 1 week
            });
            /*User.findByIdAndUpdate(user._id, { token: token }, function (err, user) {
                if (err) throw err;
            });*/
            //res.set('cookie', token);
            // return the information including token as JSON
            res.set('x-access-token', "1" + token).json({
                success: true,
                message: 'Enjoy your token!',
                token: "1" + token
            });

        }
    });

});

router.post('/emailAlreadyExists', async (req, res, next) => {
    console.log(req.body);


    let user = await User.findOne({ email: req.body.email })
    if (user) {
        res.json({ success: true, message: "User already existis" });
    }
    else {
        res.json({ success: false, message: "User doest not existis" });
    }

});

router.post('/userCheck', tokenVerify, async (req, res, next) => {
    //console.log(req.body);
    let token = req.body.token.substring(1);
    let authentication = await jwt.verify(token, config.secret)

    User.find({ email: authentication.email }, { password: authentication.password }, {
        returnNewDocument: true, new: true,
        projection: { "email": 1, "username": 1, "roles": 1 }
    }, (err, user) => {
        console.log(user);
        if (user && user !== null && user.length > 0) {

            res.json({ success: true, message: "User authenticated", data: user });
        }
        else {
            res.status(500).json({ success: false, message: "User not authenticated" });
        }
    });


});

router.post('/forgot_password', async (req, res, next) => {
    let origin = req.headers.origin;
    let user;
    try {
        user = await User.findOne({ email: req.body.email });
        if (user) {
            crypto.randomBytes(20, async (err, buffer) => {
                var token = buffer.toString('hex');
                let updateUser = await User.findByIdAndUpdate({ _id: user._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true }).exec();

                var data = {
                    to: req.body.email,
                    from: "arun.reddy143@gmail.com",
                    template: 'forgot-password-email',
                    subject: 'Password help has arrived!',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        origin + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'

                };
                if (updateUser) {
                    transporter.sendMail(data, function (err) {
                        if (!err) {
                            return res.json({ success: true, message: 'Kindly check your email for further instructions', token: token });
                        } else {
                            return res.json({ success: false, message: err });
                            // return done(err);
                        }
                    });
                }

            });
        } else {
            return res.status(500).send({ success: false, message: "Cannot locate you" })
        }
    } catch (e) {
        return res.status(500).send({ success: false, message: "Cannot locate you" });
    }



});

router.post('/reset', (req, res) => {
    let params = req.body.resetPasswordToken;

    console.log(params);

    User.findOne({ resetPasswordToken: params, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            res.json({
                success: false,
                message: 'Passport reset not successful'
            });

        }
        if (user) {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
                var mailOptions = {
                    to: "arun.reddy143@gmail.com",
                    from: 'passwordreset@demo.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                    res.json({
                        success: true,
                        message: 'Passport reset successful'
                    });
                });
            });
        }


    });
});

router.get('/checkToken', tokenVerify, (req, res, next) => {
    res.json({
        success: true,
        message: 'token valid'
    });
});

router.post('/getDetails', async (req, res, next) => {

    User.find({ email: req.body.email }, (err, data) => {
        data[0].roles.map(role => {
            //console.log(role)
            if (role === 'admin') {
                User.find({}, 'email roles username', (err, data) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'cannot access',
                            error: err
                        });
                    }
                    res.json({
                        success: true,
                        message: 'fetching user details',
                        data: data
                    });
                });
            }

            else {

            }
        });



    });
});

router.post('/updateUserDetails', async (req, res, next) => {
    await User.findOneAndUpdate({ email: req.body.email }, { roles: req.body.newRoles }, {
        returnNewDocument: true, new: true,
        projection: { "email": 1, "username": 1, "roles": 1 }
    }, (err, data) => {
        res.json({ success: true, message: "Details updated", data: data });
    });
});

module.exports = router;
