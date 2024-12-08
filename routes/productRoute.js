const router = require('express').Router()
const { addProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct, getProductByCategory } = require('../controller/productController')
const upload = require('../middleware/fileUpload')


router.post('/addproduct', upload.single('product_image'), addProduct)
router.get('/getallproducts', getAllProducts)
router.get('/getproductdetails/:id', getProductDetails)
router.put('/updateproduct/:id', upload.single('product_image'), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)

router.get('/getproductsbycategory/:categoryId', getProductByCategory)

module.exports = router