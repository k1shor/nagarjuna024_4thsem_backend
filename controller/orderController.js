const Order = require('../models/OrderModel')
const OrderItems = require('../models/OrderItemsModel')

// place order
exports.placeOrder = async (req, res) => {
    let orderItems = await Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let orderItemToAdd = await OrderItems.create({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            if (!orderItemToAdd) {
                return res.status(400).json({ error: "Something went wrong" })
            }
            return orderItemToAdd._id
        })
    )

    let individual_total = await Promise.all(
        orderItems.map(async orderItem => {
            let orderItemAdded = await OrderItems.findById(orderItem).populate('product', 'product_price')
            return orderItemAdded.quantity * orderItemAdded.product.product_price
        })
    )

    let total = individual_total.reduce((acc, cur) => acc + cur)
    let orderToPlace = await Order.create({
        orderItems,
        total,
        user: req.body.user,
        street_address: req.body.street_address,
        alternate_street_address: req.body.alternate_street_address,
        city: req.body.city,
        postal_code: req.body.postal_code,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone
    })

    if (!orderToPlace) {
        return res.status(400).json({ error: "Failed to place order" })
    }
    res.send(orderToPlace)
}

// get all orders
exports.getAllOrders = async (req, res) => {
    let orders = await Order.find().populate('user', 'username')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}
// get order details
exports.getOrderDetails = async (req, res) => {
    let order = await Order.findById(req.params.id).populate('user', 'username')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!order) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(order)
}
// get order of a user
exports.getOrderByUser = async (req, res) => {
    let orders = await Order.find({ user: req.params.userid }).populate('user', 'username')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// update status
exports.updateStatus = async (req, res) => {
    let order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    }, { new: true })
    if (!order) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(order)
}

// deleteOrder
exports.deleteOrder = (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(order => {
            if (!order) {
                return res.status(400).json({ error: "Order not found" })
            }
            order.orderItems.map((ORDERITEM) => {
                OrderItems.findByIdAndDelete(ORDERITEM)
                    .then(orderItem => {
                        if (!orderItem) {
                            return res.status(400).json({ error: "Something went wrong" })
                        }

                    })
                    .catch(error => res.status(400).json({ error: error }))
            })
            res.send({ message: "Order removed successfully" })
        })
        .catch(error => res.status(400).json({ error: error }))
}