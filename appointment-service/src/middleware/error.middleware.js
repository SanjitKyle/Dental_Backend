export const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // 1. Handle invalid MongoDB ObjectId format
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // 2. Handle duplicate unique key / double-booking in MongoDB
    if (err.code === 11000) {
        statusCode = 409;
        const keys = Object.keys(err.keyValue || {});
        if (keys.includes('doctor') && keys.includes('date') && keys.includes('start_time')) {
            message = 'This doctor already has an appointment scheduled at this time slot.';
        } else {
            const field = keys[0] || 'Field';
            message = `${field} already exists. Please use another value!`;
        }
    }

    // 3. Send clean JSON response
    res.status(statusCode).json({
        success: false,
        status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
        message
    });
};

export default globalErrorHandler;
