const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const Token = require('../models/TokenModel')
const crypto = require('crypto')
const sendMail = require('../middleware/emailSender')

exports.register = async (req, res) => {
    // check if username is available
    let usernameExists = await User.findOne({ username: req.body.username })
    if (usernameExists) {
        return res.status(400).json({ error: "Username not available." })
    }

    // check if email is already registered
    let emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) {
        return res.status(400).json({ error: "Email already registered." })
    }

    // encrypt password
    let saltRounds = 10
    let salt = await bcrypt.genSalt(saltRounds)
    let hashed_password = await bcrypt.hash(req.body.password, salt)

    // save user
    let user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashed_password
    })

    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // generate token
    let token = await Token.create({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })

    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send email
    const URL = `http://localhost:5000/verify/${token.token}`
    sendMail({
        from: 'no-reply@something.com',
        to: req.body.email,
        subject: 'Verification email',
        text: 'Thank you for registration',
        html: `<a href='${URL}'><button>Verify Now</button></a>`
    })

    // send message to user
    res.send(user)
}

// verify user
exports.verifyEmail = async (req, res) => {
    // check if token is valid
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    // check if user is already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }
    // verify user
    user.isVerified = true
    user = await user.save()
    // send message to user
    res.send({ message: "User verified successfully" })
}

// forget password
exports.forgetpassword = async (req, res) => {
    // check if email is registered
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // generate password reset token
    let token = await Token.create({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send token in email
    const URL = `http://localhost:5000/resetpassword/${token.token}`
    sendMail({
        from:'noreply@something.com',
        to: req.body.email,
        subject: "Password reset link",
        text: "Click on the given link to reset your password" + URL,
        html: `<a href='${URL}'><button>Reset Password</button></a>`
    })
    // send message to user
    res.send({message:"Password reset link has been sent to your email"})
}

exports.resetPassword = async (req, res) => {
    // check if token is valid
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired"})
    }
    // find user
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found"})
    }
    let saltRounds = 10
    let salt = await bcrypt.genSalt(saltRounds)
    let hashed_password = await bcrypt.hash(req.body.password, salt)

    user.password = hashed_password
    user = await user.save()

    res.send({message: "Password reset successful."})
}

// resend verification
exports.resendVerification = async (req, res) => {
    // check email
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered." })
    }
    // check if already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "Email already verified." })
    }
    // generate token
    let token = await Token.create({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send token in email
    // const URL = `http://localhost:5000/verify/${token.token}`
    const URL = `${process.env.FRONTEND_URL}/verify/${token.token}`
    sendEmail({
        from: "no-reply@something.com",
        to: req.body.email,
        subject: "verificiation email",
        text: "Click on the following link to verify email. " + URL,
        html: `<a href='${URL}'><button>Verify Now</button></a>`
    })

    // send message to user
    res.send({ message: "Verification Link has been sent to your email." })
}

// user list
exports.getAllUsers = async (req, res) => {
    let users = await User.find()
    if(!users){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(users)
}

// user details

// update user

// delete user

// login
exports.login = async (req, res) => {
    let { email, password } = req.body
    // check email
    let user = await User.findOne({ email })

    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }

    // check password
    let passwordCorrect = await bcrypt.compare(password, user.password)
    if (!passwordCorrect) {
        return res.status(400).json({ error: "Password incorrect" })
    }

    // check if verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified." })
    }

    // generate login token
    let { _id, role, username } = user

    let token = jwt.sign({
        _id, role, username, email
    }, process.env.JWT_SECRET)

    // set token in cookies
    res.cookie('myCookie', token, { expire: Date.now() + 86400 })

    // send information to user
    res.send({
        token, user: { _id, email, username, role }
    })
}

// require user
exports.requireUser = (req, res, next) => {
    expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256']
    })(req, res, err => {
        if (err) {
            return res.status(401).json({ error: "User not logged in" })
        }
        next()
    })
}

// require Admin
exports.requireAdmin = (req, res, next) => {
    expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        userProperty: 'auth'
    })(req, res, err => {
        if (err) {
            return res.status(401).json({ error: "User not logged in" })
        }
        else if (req.auth.role !== 1) {
            return res.status(403).json({ error: "Authorization error" })
        }
        else {
            next()
        }
    })
}

exports.signOut = (req, res) => {
    res.clearCookie('myCookie')
    res.send({ message: "Signed out successfully" })
}