const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

require('dotenv').config()
const express = require('express')
const factoryRouter = require('./routes/factory.routes')
const productRouter = require('./routes/product.routes')
const agentRouter = require('./routes/agent.routes')
const customerRouter = require('./routes/customer.routes')
const addressRouter = require('./routes/address.routes')
const godownRouter = require('./routes/godown.routes')
const masonRouter = require('./routes/mason.routes')
const brandsRouter = require('./routes/brands.routes')
const categoryRouter = require('./routes/category.routes')
//const servicesCategoryRouter = require('./routes/services/servicesCategory.routes')
const orderRouter = require('./routes/order.routes')
const paymentRouter = require('./routes/payment.routes')
const productFiltersRouter = require('./routes/productFIlters.routes')
const usersRouter = require('./routes/users.routes')
const loginRouter = require('./routes/login.routes')
const refreshTokenRouter = require('./routes/refreshToken.routes')
const orderItemsRouter = require('./routes/orderItems.routes')
const wishListRouter = require('./routes/wishList.routes')
const cartRouter = require('./routes/cart.routes')
const reviewsRouter = require('./routes/reviews.routes')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const { authenticateUser } = require('./utils/index.utils')
const logger = require('./logger')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
/* app.use(
    cors({
        origin: 'http://localhost:3001', // Replace with your frontend URL
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
    })
)

// Your routes here
app.get('/', (req, res) => {
    res.send('CORS enabled!')
})

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
}
 */
const allowedRequests = [
    '/api/login',
    '/api/brands',
    '/api/productfilters',
    '/api/product',
    '/api/category',
    '/api/refresh-token',
    '/api-docs',
    '/api/reviews',
    '/order/validate',
]

const allowedPostRequests = ['/api/users']

// Apply authenticateUser middleware for all routes except '/public' and '/login'
app.use((req, res, next) => {
    if (
        allowedRequests.some((path) =>
            req.path.toLocaleLowerCase().startsWith(path.toLocaleLowerCase())
        ) ||
        (req.method === 'POST' &&
            allowedPostRequests.includes(req.path.toLocaleLowerCase()))
    ) {
        return next()
    }
    authenticateUser(req, res, next)
})

// // Custom error handler middleware
// app.use((err, _req, res,next) => {
//     console.log('alert')
//     if (res.statusCode >= 400){

//     }
//         // Log the error using Winston
//         logger.error(`Unhandled error: ${err.message}`)

//     // Respond with an error to the client
//     res.json({ error: err })
// })

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/factory', factoryRouter)
app.use('/api/product', productRouter)
app.use('/api/agent', agentRouter)
app.use('/api/customer', customerRouter)
app.use('/api/address', addressRouter)
app.use('/api/godown', godownRouter)
app.use('/api/mason', masonRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/productfilters', productFiltersRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/refresh-token', refreshTokenRouter)
app.use('/api/order-items', orderItemsRouter)
app.use('/api/wishlist', wishListRouter)
app.use('/api/cart', cartRouter)
app.use('/api/reviews', reviewsRouter)
//app.use('/api/services/category', servicesCategoryRouter)

const port = process.env.PORT || 3000

// eslint-disable-next-line no-console

app.listen(port, () => logger.info(`Listenting on port ${port}`))
