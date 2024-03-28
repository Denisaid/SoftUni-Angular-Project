const mongoose = require('mongoose');

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 400;

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(statusCode).json({ message: Object.values(err.errors).map(error => error.message), statusCode });
    } else if (err instanceof mongoose.Error) {
        if (err.code === 11000) {
            return res.status(400).json({ message: ['Duplicate key error'], statusCode: 400 });
        } else {
            return res.status(500).json({ message: ['Internal server error', err], statusCode: 500 });
        }
    } else if (Array.isArray(err)) {
        return res.status(statusCode).json({ message: err.map(error => error.msg), statusCode });
    } else if (err instanceof Error) {
        return res.status(statusCode).json({ message: [err.message], statusCode });
    } else if (err instanceof TypeError) {
        return res.status(statusCode).json({ message: [err.message], statusCode });
    }

    return res.status(500).json({ message: ['Internal server error', err], statusCode: 500 });
};