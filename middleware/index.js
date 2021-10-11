const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({
            status: "Bad request",
            message: "A token is required for authentication"
        });
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1], config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({
            status: "Bad request",
            message: "Invalid Token"
        });
    }
    
    return next();
};

module.exports = verifyToken;