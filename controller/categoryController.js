const Category = require('../models/categoryModel')

// CRUD - create, read, update, delete

// add new category
exports.addCategory = async (req, res) => {
    let categoryExists = await Category.findOne({ category_name: req.body.category_name })
    if (categoryExists) {
        return res.status(400).json({ error: "Category already exists." })
    }

    let categoryToAdd = await Category.create({
        category_name: req.body.category_name
    })
    if (!categoryToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categoryToAdd)
}

/* status code - 
200 - OK

404 - not found
400 - bad request
401 - unauthorized
403 - unauthorized

CRUD -
    create(newObj) - inserts the newObj into database 
    
    find() - returns all data
    findById(id) - returns the data with the given id
    findOne(filterObj) - returns data that matches the filterObj

    findByIdAndUpdate(id,updatingObj, options)
        id - which to update
        updatingObj - what to update
        options - {new:true}
        
    findByIdAndDelete(id) - removes the data that has the given id
*/

exports.getAllCategories = async (req, res) => {
    let categories = await Category.find()
    if (!categories) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categories)
}

exports.getCategoryDetails = async (req, res) => {
    let category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}

exports.updateCategory = async (req, res) => {
    let categoryToUpdate = await Category.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name
    }, { new: true })
    if (!categoryToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categoryToUpdate)
}

exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then(deletedCategory => {
            if (!deletedCategory) {
                return res.status(400).json({ error: "Category not found" })
            }
            res.send({ message: "Category Deleted Successfully" })
        })
        .catch(error => {
            return res.status(400).json({ error: error })
        })
}

// exports.deleteCategory = async (req, res) => {
//     try{
//         let deletedCategory = await Category.findByIdAndDelete(id)
//         if (!deletedCategory) {
//             return res.status(400).json({ error: "Category not found" })
//         }
//         res.send({ message: "Category Deleted Successfully" })
//     }
//     catch(error){
//         return res.status(400).json({ error: error })
//     }
// }