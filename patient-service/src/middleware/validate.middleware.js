import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;

        next();
    } catch (err) {
        if (err.errors) {
            const errorMessages = err.errors.map(e => `${e.path.filter(p => p !== 'body' && p !== 'params' && p !== 'query').join('.') || e.path.join('.')}: ${e.message}`).join(', ');
            return next(new AppError(errorMessages, 400));
        }
        next(err);
    }
};

export default validate;
