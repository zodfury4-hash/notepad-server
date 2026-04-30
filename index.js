import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import noteRoutes from './noteRoutes.js';
import authRoutes from './authRoutes.js'; // Import your new auth file

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MONGODB CONNECTION ---
// Using your provided Atlas URI
const mongoURI = "mongodb+srv://zodfury4_db_user:3388@cluster0.l6hgyjn.mongodb.net/notezilla?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas (Notezilla)"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- ROUTES ---
app.use("/api/auth", authRoutes); // Logic for Register/Login
app.use("/api/notes", noteRoutes); // Logic for Notes (Now Protected)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;