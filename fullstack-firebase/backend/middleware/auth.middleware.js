const { admin } = require("../firebase/firebaseConfig");

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) throw new Error("Unauthorized");

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = { authenticate };
