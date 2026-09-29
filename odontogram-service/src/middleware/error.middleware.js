export const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // 1. Handle invalid MongoDB ObjectId format
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // 2. Handle duplicate unique key in MongoDB
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'Field';
        message = `${field} already exists. Please use another value!`;
    }

    // 3. Send clean JSON response
    res.status(statusCode).json({
        success: false,
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        message
    });
};

export default globalErrorHandler;
