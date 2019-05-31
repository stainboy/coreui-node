const path = require('path');

module.exports = {
    openapi: '3.0.0',
    info: {
        // API informations (required)
        title: 'EYS Lab scaffold-node', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'A sample API', // Description (optional)
    },
    servers: [
    ],
    apis: [path.join(__dirname, './src/**/**/*.ts')]
};
