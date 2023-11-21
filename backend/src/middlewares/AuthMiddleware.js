const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("token");
    console.log("Access normal Token:", accessToken);

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

const validateSocketToken = (socket, next) => {
    const accessToken = socket.handshake.query.token;
    console.log("Access Socket Token:", accessToken);

    if (!accessToken) {
        return next(new Error("User not authenticated"));
    }

    // Validate the token
    verify(accessToken, "secret", (error, decoded) => {
        if (error) {
            console.error("Token Verification Error:", error);
            console.log("Invalid Token:", accessToken);
            return next(new Error("Invalid token"));
        }

        // Attach decoded information to the socket
        socket.decoded = decoded;
        next();
    });
};

module.exports = { validateToken, validateSocketToken };
