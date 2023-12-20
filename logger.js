const winston = require('winston')

// Define the Winston logger configuration
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file
        // Add more transports as needed
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
})

module.exports = logger
