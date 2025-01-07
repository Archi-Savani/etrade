const Product = require("../models/ProductModel")
const asyncHandler = require("express-async-handler")

const createProduct = asyncHandler(async (req,res) => {
    try{
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    }catch (error){
        throw new Error(error)
    }
})


const updateProduct = asyncHandler(async (req, res) => {
    console.log("chjkl")
    const { id } = req.params;
    console.log(req.params)
    console.log(id , "idd")
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id }, // Correct query
            req.body,
            { new: true } // Ensures the returned document is the updated one
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    console.log("chjkl")
    const { id } = req.params;
    console.log(req.params)
    console.log(id , "idd")
    try {
        const deleteProduct = await Product.findOneAndDelete({ _id: id })
        if (!deleteProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(deleteProduct);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});


const getaProduct = asyncHandler (async  (req , res) => {
    const {id} = req.params
    console.log(id)
    try{
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    }catch (error) {
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler (async  (req , res) => {
    console.log(req.params)
    try{
        // filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page' , 'sort' , 'limit' , 'fields']
        excludeFields.forEach((el) => delete queryObj[el])
        console.log(queryObj , "queryobj")

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}`);
        console.log(JSON.parse(queryStr) , "all");

        let query = Product.find(JSON.parse(queryStr));


        // sorting
        if (req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort('sortBy')
        }else{
            query = query.sort('-createdAt')
        }

        // limiting the fildesx
        if (req.query.fields){
            const fields = req.query.fields.split(',').join(" ")
            query = query.select(fields)
        }else {
            query = query.select('-__v')
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>= productCount) throw new error('this page is not exists')
        }
        console.log(page , limit , skip , 'fghjkl;');

        const product = await query;

        console.log(queryObj , req.query , "gvhbjkl")

        res.json(product)
    }catch (error) {
        throw new Error(error)
    }
})

module.exports = {createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct}