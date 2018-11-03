const winston = require('winston');
module.exports = (options) => {
    return (req, res, next) => {
        console.log(options);
        winston.log('info', 'Hello log files!', {
            someKey: next
        })
        // Implement the middleware function based on the options object
        Promise.resolve(options(req, res, next)).catch(next)
    }
}