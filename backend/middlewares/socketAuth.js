import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const socketAuth = async (socket, next) => {
    try {
        // Get token from the header section 
        const token = socket.handshake.auth?.token;
        if (!token) {
            return (next(new Error("Authentication Error : Token is Missing")));
        }

        // verify Jwt
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // find user from db 
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return (next(new Error("Authentication Error : User Not found")));
        }

        socket.user = user;
        next();



    } catch (error) {
        return next(new Error("Authenication Error : Token Invalid or expired"))
    }
}
export default socketAuth;