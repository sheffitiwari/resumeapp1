var express = require('express');
var router = express.Router();
const User = require('../models/user.js')
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('manager');
});





router.post('/signup', User.signup)
router.get('/signin', User.signin)

router.get('/signin', function (req, res) {

    User.signin();
    User.checkPassword();
    User.authenticate();
    User.findByToken();
    User.findUser();
})

module.exports = router;