import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorzation header Missing",
            })
        }

        // check Beareer format
        if (!authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: "Invalid token Format",
            })
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        })
    }
} 