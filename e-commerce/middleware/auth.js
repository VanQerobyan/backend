const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.SECRET_KEY;

function authenticate(req, res, next) {

    const header = req.headers["authorization"];

   if (!header) {
    return res.status(401).json({ error: "No token provided." });
}

    const bearer = header.split(" ")[1];

    if (!bearer) {
        return res.status(401).json({ error: "Invalid authorization header" });
    }


    try {
        const verifyToken = jwt.verify(bearer, SECRET_KEY);
        req.user = verifyToken;
        next();
    } catch (error) {

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
}

function authorize(...roles) {
    return (req, res, next) => {

        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    };
}


module.exports = {authenticate, authorize}