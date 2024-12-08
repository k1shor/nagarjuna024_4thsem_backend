const Product = require('../models/productModel')
const fs = require('fs')

exports.addProduct = async (req, res) => {
    let productToAdd = await Product.create({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        description: req.body.description,
        product_image: req.file?.path,
        category: req.body.category
    })
    if (!productToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToAdd)
}

exports.getAllProducts = async (req, res) => {
    let products = await Product.find()
        .populate('category', 'category_name')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

exports.getProductDetails = async (req, res) => {
    let product = await Product.findById(req.params.id)
        .populate('category', 'category_name')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

exports.updateProduct = async (req, res) => {
    if (req.file) {
        let product = await Product.findById(req.params.id)
        fs.unlink(product.product_image)
    }

    let productToUpdate = await Product.findByIdAndUpdate(req.params.id, {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        description: req.body.description,
        category: req.body.category,
        product_image: req.file?.path
    }, { new: true })
    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToUpdate)
}

exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(deletedProduct => {
            if (!deletedProduct) {
                return res.status(400).json({ error: "Product not found" })
            }
            res.send({ message: "Product Deleted Successfully" })
        })
        .catch(error => {
            return res.status(400).json({ error: error })
        })
}

exports.getProductByCategory = async (req, res) => {
    let products = await Product.find({
        category: req.params.categoryId
    })
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}