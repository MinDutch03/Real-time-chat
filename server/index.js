const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const { app, server } = require('./socket/index')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'A simple Express API application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 8080

app.get('/', (request, response) => {
    response.json({
        message: "Server running at " + PORT
    })
})

// API endpoints
app.use('/api', router)

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("server running at " + PORT)
    })
})
