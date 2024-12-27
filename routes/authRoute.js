const express =  require("express")
const router = express.Router()
const {createUser,loginUserCtrl,getallUser, getSingleUser, deleteUser, updateUser} = require("../controllers/userCtrl")
const {authMiddleware, isAdmin} = require("../middleware/authMiddleware")

router.post('/register',createUser)
router.post('/login',loginUserCtrl)
router.get("/all-users", getallUser)
router.get("/:id",authMiddleware,isAdmin, getSingleUser)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)

module.exports = router