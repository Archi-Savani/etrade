const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {uploadFiles} = require("../helpers/productImage");

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const {
            title,
            category,
            sub_category,
            slug,
            description,
            price,
            producttype,
            brand,
            quantity,
            sold,
            color_options,
            size_options,
            rate,
            gender,
            stock,
            instruction,
        } = req.body;

        const files = req.files;

        // Separate product_images, color_images, and gallery_images
        const productImageFiles = files.product_images || [];
        const colorImageFiles = files.color_images || [];
        const galleryImageFiles = files.gallery || [];

        // Extract file buffers for uploads
        const productImageBuffers = productImageFiles.map((file) => file.buffer);
        const colorImageBuffers = colorImageFiles.map((file) => file.buffer);
        const galleryImageBuffers = galleryImageFiles.map((file) => file.buffer); // Fix this line to treat gallery images as files

        // Upload images
        const productImageUrls = await uploadFiles(productImageBuffers);
        const colorImageUrls = await uploadFiles(colorImageBuffers);
        const galleryImageUrls = await uploadFiles(galleryImageBuffers);


        const updatedColorOptions = await Promise.all(parsedColorOptions.map(async (colorOption, index) => {
            const colorImages = files
                .filter(file => file.fieldname === `color_images[${index}]`)
                .map(file => file.buffer);

            const uploadedImages = await uploadFiles(colorImages);  // Assuming uploadFiles returns a promise

            return {
                ...colorOption,
                color_images: uploadedImages,
            };
        }));

        // Create new product with the additional gallery_images field
        const newProduct = await Product.create({
            user_id: user._id,
            title,
            category,
            sub_category,
            slug,
            description,
            price: JSON.parse(price),
            producttype,
            brand,
            quantity: JSON.parse(quantity),
            sold: JSON.parse(sold),
            color_options: JSON.parse(color_options),
            size_options: JSON.parse(size_options),
            rate: JSON.parse(rate),
            gender,
            stock: JSON.parse(stock),
            instruction,
            product_images: productImageUrls,
            color_images: colorImageUrls,
            gallery: galleryImageUrls, // Include gallery_images in the database
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id).populate("category").populate("ratings.postedby");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((field) => delete queryObj[field]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exist");
        }

        const products = await query;

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
};
