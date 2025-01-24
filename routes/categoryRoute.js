const router = require('express').Router();
const { handleGetCategories,
    handleGetSingleCategory,
    handleCreateCategory,
    handleGetCategoriesByGender,
    handleEditCategory,
    handleDeleteCategory} = require('../controllers/categoryCtrl');
const {
    handleGetSubcategories,
    handleAddSubcategory,
    handleEditSubcategory,
    handleGetSingleSubcategory,
    handleGetSubcategoriesGroupedByCategory,
    handleDeleteSubcategory
} = require('../controllers/subcategoryCtrl');
const multer = require('multer');
const {authMiddleware} = require("../middleware/authMiddleware");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get('/gender-wise', handleGetCategoriesByGender);
router.get('/', handleGetCategories);
router.get('/:categoryId', handleGetSingleCategory);
router.post('/',authMiddleware, upload.single("image"), handleCreateCategory);
router.put('/:categoryId',authMiddleware, upload.single("image"), handleEditCategory);
router.delete('/:categoryId',authMiddleware, handleDeleteCategory);


router.get('/subcategory/list', handleGetSubcategoriesGroupedByCategory);
router.get('/:categoryId/subcategory', handleGetSubcategories);
router.get('/subcategory/:subcategoryId', handleGetSingleSubcategory);
router.post('/:categoryId/subcategory',authMiddleware, upload.single("image"), handleAddSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId',authMiddleware ,upload.single("image"), handleEditSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId',authMiddleware, handleDeleteSubcategory);

module.exports = router;