var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'itscitsc',
        database: 'Resumeappdatabase',
        charset: 'utf8'
    }
});
var bookshelf = require('bookshelf')(knex);
var User = bookshelf.Model.extend({
    tableName: 'Users',
});

const bcrypt = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const environment = process.env.NODE_ENV || 'development';    // set environment
const configuration = require('../knexfile')[environment];   // pull in correct db with env configs
const database = require('knex')(configuration);           // define database based on above
const crypto = require('crypto')                         // built-in encryption node module

const signup = (request, response) => {
    const user = request.body.person
    console.log(user)
    bcrypt.hash(user.password, 10, function (err, hash) {
        console.log(hash)
    });

    hashPassword(user.password)
        .then((hashedPassword) => {
            delete user.password
            user.password_digest = hashedPassword
        })
        .then(() => createToken())
        .then(token => user.token = token)
        .then(() => createUser(user))
        .then(user => {
            delete user.password_digest
            response.status(201).json({ user })
        })
        .catch((err) => console.error(err))
}



const hashPassword = (password) => {
    return new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash)
        })
    )
}


const createUser = (user) => {
    return User.forge({

        email: user.email,
        password: user.password
    })
        .save()
};

const createToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, data) => {
            err ? reject(err) : resolve(data.toString('base64'))
        })
    })
}

const signin = (request, response) => {
    const userReq = request.body
    let user

    findUser(userReq)
        .then(foundUser => {
            user = foundUser
            return checkPassword(userReq.body.password, foundUser)
        })
        .then((response) => createToken())
        .then(token => updateUserToken(token, user))
        .then(() => {
            delete user.password_digest
            response.status(200).json(user)
        })
        .catch((err) => console.error(err))
}

const findUser = (userReq) => {
    return User
        .query('where', 'email', '=', userReq.body.email)
        .fetch()
        .then(function (model) {
            // ...
        });
}

const checkPassword = (reqPassword, foundUser) => {
    return new Promise((resolve, reject) =>
        bcrypt.compare(reqPassword, foundUser.password_digest, (err, response) => {
            if (err) {
                reject(err)
            }
            else if (response) {
                resolve(response)
            } else {
                reject(new Error('Passwords do not match.'))
            }
        })
    )
}

const updateUserToken = (token, user) => {
    return User.set({ token: token })
};

const authenticate = (userReq) => {
    console.log("Starting to authenticate")
    findByToken(userReq.token)
        .then((user) => {
            if (user.email == userReq.body.email) {
                return true
            } else {
                return false
            }
        })
}

const findByToken = (token) => {
    return User
        .query('where', 'Token', '=', token)
        .fetch()
        .then(function (model) {
            // ...
        });
}

module.exports = {
    signup, signin, findUser, checkPassword, updateUserToken, authenticate, findByToken
}
