const express = require('express')
const router = express.Router()
const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')

router.post('/addCategory', addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)

module.exports = router