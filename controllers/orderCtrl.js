const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const asyncHandler = require("express-async-handler");

const handleGetOrder = asyncHandler(async (req, res) => {
    const orderProducts = await Order.find({});
    return res.json(orderProducts);
})

const handleGetSingleOrder = asyncHandler(async (req, res) => {
    const {orderId} = req.params;
    const orderProduct = await Order.findById(orderId);
    if (!orderProduct) {
        res.status(404)
        throw new Error('Order not found');
    }
    return res.json(orderProduct);
})


const handleAddOrder = asyncHandler(async (req, res) => {
    const { product_id, qty, status } = req.body;

    try {
        // Check if the product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }
        const findedProductinOrder = await Order.findOne({  product_id });
        if (findedProductinOrder) {
            return res.status(400).json({
                status: 400,
                message: 'Product is already in ordered'
            });
        }

        const newOrder = await Order.create({
            user_id: req.user._id,
            product_id,
            qty,
            status
        });

        return res.status(201).json({
            status: 201,
            message: 'Order placed successfully',
            data: newOrder
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'Failed to place order',
            error: err.message
        });
    }
});

const handleEditOrder = asyncHandler(async (req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const validStatuses = ['placed', 'processed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400);
            throw new Error('Invalid order status');
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {status}, {new: true, runValidators: true});

        if (!updatedOrder) return res.status(404).json({status: 404, message: "Order not found"});

        return res.status(200).json({status: 200, message: "Order updated successfully", data: updatedOrder})

    } catch (err) {
        return res.status(500).json({status: 500, message: "Error updating Order", error: err})
    }
})

module.exports = {handleAddOrder, handleGetOrder, handleGetSingleOrder, handleEditOrder }