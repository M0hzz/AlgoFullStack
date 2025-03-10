import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebaseAdmin.js";  // Import Firebase setup

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test Firebase Connection
app.get("/test-firebase", async (req, res) => {
    try {
        const users = await admin.auth().listUsers();
        res.json({ success: true, users: users.users.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
