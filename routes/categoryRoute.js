const express = require('express')
const router = express.Router()
const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireAdmin } = require('../controller/userController')
const { categoryRules, validationScript } = require('../middleware/validationScript')

router.post('/addCategory', requireAdmin, categoryRules, validationScript, addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)

module.exports = router