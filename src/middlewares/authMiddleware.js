import jwt from 'jsonwebtoken';


export default (req, res, next) => {
    try {
        // 1. read Authorization Header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access Denied. No token provided.'
            });
        }

        // 2. "Bearer <token>" split string
        const token = authHeader.split(' ')[1];

        // 3. Token ko verify karein
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Decoded payload attach in request object 
        req.user = decoded;

        // 5. pass to next controler
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};
