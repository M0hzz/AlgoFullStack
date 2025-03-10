const express = require("express");
const cors = require("cors");
const { getCollection } = require("./firebase/firestore");
const { authenticate } = require("./middleware/auth.middleware");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

// Protected Route Example (Requires Firebase Authentication)
app.get("/api/algorithms", authenticate, async (req, res) => {
    try {
        const algorithms = await getCollection("algorithms");
        res.json(algorithms);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch algorithms" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
