const router = require('express').Router()
const { register, verifyEmail, forgetpassword, resetPassword, resendVerification, login, signOut, getAllUsers } = require('../controller/userController')
const { userRules, validationScript } = require('../middleware/validationScript')


router.post('/register', userRules, validationScript, register)
router.get('/verify/:token', verifyEmail)
router.post('/forgetpassword', forgetpassword)
router.post('/resetpassword/:token', resetPassword)

router.post('/resendverification', resendVerification)

router.post('/login', login)
router.get('/signout', signOut)
router.get('/userlist', getAllUsers)


module.exports = router