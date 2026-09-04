import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secret);

        req.userId = decoded?._id || decoded?.id || decoded?.userId;
        req.userRole = decoded?.role;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default authMiddleware;
