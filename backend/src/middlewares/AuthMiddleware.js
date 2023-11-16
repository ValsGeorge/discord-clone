const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("token");
    console.log("Access Token:", accessToken);

    if (!accessToken) {
        return res.status(400).json({ error: "User not authenticated" });
    }

    try {
        const validToken = verify(accessToken, "secret");
        console.log("Valid Token:", validToken);

        req.user = validToken;
        if (validToken) {
            return next();
        }
    } catch (error) {
        console.error("Token Verification Error:", error);
        console.log("Invalid Token:", accessToken);
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { validateToken };
