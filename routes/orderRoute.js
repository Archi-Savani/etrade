const router = require('express').Router();
const {handleAddOrder,handleEditOrder,handleGetOrder,handleGetSingleOrder} = require('../controllers/orderCtrl')

router.get('/',handleGetOrder);

router.get('/:orderId',handleGetSingleOrder);

router.post('/',handleAddOrder);

router.patch('/:orderId',handleEditOrder);

module.exports = router;