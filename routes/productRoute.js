const express = require("express")
const {createProduct, getaProduct,getAllProduct,updateProduct,deleteProduct} = require("../controllers/productCtrl");
const {isAdmin, authMiddleware} = require("../middleware/authMiddleware")
const router = express.Router()
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/', authMiddleware , isAdmin,  upload.fields([
    { name: 'product_images', maxCount: 1 },
    { name: 'gallery', maxCount: 4 },
    { name: 'color_images', maxCount: 10 }
]),  createProduct);
router.get("/:id", isAdmin , getaProduct)
router.put("/:id",  authMiddleware , isAdmin ,  updateProduct)
router.get("/", getAllProduct)
router.delete("/:id",  authMiddleware ,  isAdmin , deleteProduct)

module.exports = router
