const jwt = require('jsonwebtoken')

const isAdmin = async (req, res, next) => {
    const token = req.headers["authorization"];
    const decoded = await jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
    if (!decoded.is_admin) {
        return res.status(401).send({
            status: "error",
            message: "Unauthorized"
        });
    }

    return next();
}

module.exports = isAdmin