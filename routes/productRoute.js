const express = require("express")
const {createProduct} = require("../controllers/productCtrl")
const router = express.Router()


router.post('/', authMiddleware , isAdmin ,  createProduct)
router.get("/:id", isAdmin , getaProduct)
router.put("/:id",  authMiddleware , isAdmin ,  updateProduct)
router.get("/", getAllProduct)
router.delete("/:id",  authMiddleware ,  isAdmin , deleteProduct)

module.exports = router