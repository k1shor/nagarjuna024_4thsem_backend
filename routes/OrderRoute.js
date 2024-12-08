const router = require('express').Router()
const { placeOrder, getAllOrders, getOrderDetails, getOrderByUser, updateStatus, deleteOrder } = require('../controller/orderController')

router.post('/placeorder', placeOrder)
router.get('/getallorders', getAllOrders)
router.get('/getorderdetails/:id', getOrderDetails)
router.get('/getorderbyuser/:userid', getOrderByUser)
router.put('/updatestatus/:id', updateStatus)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router