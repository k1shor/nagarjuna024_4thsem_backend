const express = require('express')
require('dotenv').config()
require('./database/connection')


const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/OrderRoute')

const app = express()
app.use(express.json())


/*
app.method(endpoint, function)

method - get/post/put/delete
endpoint - route to connect frontend
function - what to do
        (request, response)=>{
            
            }
            request -> data received from user/frontend
                body -> using form
                params/query -> using url
            response -> data sent to user/frontend


*/

const port = process.env.PORT

app.use(CategoryRoute)
app.use(ProductRoute)
app.use(UserRoute)
app.use(OrderRoute)


app.listen(port, ()=>{
    console.log(`Server started successfully at port ${port}`)
})