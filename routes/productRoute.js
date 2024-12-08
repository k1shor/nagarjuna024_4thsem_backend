const router = require('express').Router()
const { addProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct, getProductByCategory } = require('../controller/productController')
const { requireAdmin } = require('../controller/userController')
const upload = require('../middleware/fileUpload')
const { productRules, validationScript } = require('../middleware/validationScript')


router.post('/addproduct', upload.single('product_image'), requireAdmin, productRules, validationScript, addProduct)
router.get('/getallproducts', getAllProducts)
router.get('/getproductdetails/:id', getProductDetails)
router.put('/updateproduct/:id', upload.single('product_image'), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)

router.get('/getproductsbycategory/:categoryId', getProductByCategory)

module.exports = router