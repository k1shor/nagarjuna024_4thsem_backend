const { check, validationResult } = require('express-validator')

exports.categoryRules = [
    check('category_name', "Category is required.").notEmpty()
        .isLength({ min: 3 }).withMessage("category must be at least 3 characters")
        .matches(/^[a-zA-Z]+$/).withMessage('Category must only be alphabets')
]

exports.validationScript = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

exports.productRules = [
    check('product_name', "Product name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters"),
    check('product_price', "Product price is required").notEmpty()
        .isNumeric().withMessage("Price must be a number"),
    check('description', "Description is required").notEmpty()
        .isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
    check('count_in_stock', "Count is required").notEmpty()
        .isNumeric().withMessage("Count must be a number"),
    check('category', "category is required").notEmpty()
        .matches(/^[0-9a-f]{24}$/).withMessage("Invalid category")
]

exports.userRules = [
    check('username', "Username is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
        .not().isIn(['GOD', "DOG", "TEST", "ADMIN", "USER"]).withMessage("invalid username"),
    check('email', "Email is required").notEmpty()
        .isEmail().withMessage("Email format incorrect"),
    check('password', "Password is required").notEmpty()
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase alphabet")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase alphabet")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[!@#$_.-]/).withMessage("Password must contain at least one special character")
        .isLength({ min: 8 }).withMessage("password must be at least 8 characters")
        .isLength({ max: 30 }).withMessage("Password must not exceed 30 characters")
]