// productSchema.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_images: [
        {
            type: String,
            required: true
        },
    ],
    title: {
        type: String,
        required: true,
        // trim: true
    },
    category: {
        type: String,
        ref: "Category"
    },
    subCategory: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        // unique: true,
        // lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        actualPrice: {
            type: Number,
            required: true
        },
        salePrice: {
            type: Number
        },
    },
    productType: {
        type: String
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    colors: [
        {
            colorName: {
                type: String
            },
            color_images:
                {
                    type: Array
                }
        }
    ],
    sizes: [
        {
            size: {
                type: String
            },
            stock: {
                type: Number
            }
        }
    ],
    gallery: [
        {
            type: String
        }
    ],
    rating: {
        average: {
            type: Number
        },
        count: {
            type: Number
        }
    },
    gender: {
        type: String
    },
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);
