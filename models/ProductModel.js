// productSchema.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        orignal_price: {
            type: Number,
        },
        discounted_price: {
            type: Number
        },
    },
    category: {
        type: String,
        ref: "Category"
    },
    sub_category: {
        type: String
    },
    producttype: {
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
    color_options: [
        {
            color: {
                type: String
            },
            color_images: [
                {
                    type: String
                }
            ]
        }
    ],
    size_options: [
        {
            size: {
                type: String
            },
            stock: {
                type: Number
            }
        }
    ],
    thumbnail: {
        type: String
    },
    gallery: [
        {
            type: String
        }
    ],
    rating: [
        {
            average: {
                type: Number
            },
            count: {
                type: Number
            }
        }
    ],
    offers: [
        {
            type: {
                type: String
            },
            details: {
                type: String
            }
        }
    ],
    availability: {
        isInStock: {
            type: Boolean
        },
        deliveryOptions: {
            standardDelivery: {
                type: String
            },
            fastestDelivery: {
                type: String
            }
        }
    },
    reviews: [
        {
            user: {
                type: String
            },
            rating: {
                type: Number
            },
            comment: {
                type: String
            },
            date: {
                type: String
            }
        }
    ],
    gender: {
        type: String
    },
    instruction: {
        type: String
    },
    ASIN: {
        type: String
    },
    dimensions: {
        height: {
            type: Number
        },
        width: {
            type: Number
        },
        depth: {
            type: Number
        },
        weight: {
            type: Number
        }
    },
    shippingDetails: {
        shippingWeight: {
            type: Number
        },
        dimensions: {
            height: {
                type: Number
            },
            width: {
                type: Number
            },
            depth: {
                type: Number
            }
        },
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
